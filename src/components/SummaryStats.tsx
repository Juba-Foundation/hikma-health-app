import React, {useEffect, useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import Header from './shared/Header';
import {database} from '../storage/Database';
import styles from './Style';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigation';
import {CustomDatePicker} from './shared/CustomDatePicker';
import moment from 'moment';
import _ from 'lodash';

type Props = NativeStackScreenProps<RootStackParamList, 'SummaryStats'>;

export default function SummaryStats(props: Props) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Data
  const [patientsCount, setPatientsCount] = useState(0);
  const [patientVisits, setPatientVisits] = useState<any[]>([]);

  useEffect(() => {
    database.getPatientCount().then((res) => {
      setPatientsCount(res);
    });
  }, []);

  const sexesCount = patientVisits.reduce((prev, curr) => {
    if (prev[curr.sex]) {
      return {...prev, [curr.sex]: prev[curr.sex] + 1};
    }
    return {
      ...prev,
      [curr.sex]: 1,
    };
  }, {});

  const ageDistribution = patientVisits.reduce(
    (prev, curr) => {
      const years = moment().diff(
        moment(curr.date_of_birth, 'DD MMM YYYY'),
        'years',
      );

      const group = (() => {
        if (years < 1) {
          return '0-1';
        } else if (years < 5) {
          return '1-5';
        } else if (years < 12) {
          return '5-12';
        } else if (years < 18) {
          return '12-18';
        } else if (years < 60) {
          return '18-60';
        } else {
          return '60-100';
        }
      })();

      return {
        ...prev,
        [group]: prev[group] + 1,
      };
    },
    {
      '0-1': 0,
      '1-5': 0,
      '5-12': 0,
      '12-18': 0,
      '18-60': 0,
      '60-100': 0,
    },
  );

  const ageDistribution2 = _.countBy(
    patientVisits.map((pV) => {
      // const diff = moment(pV.date_of_birth).diff(moment(), 'milliseconds');
      // return moment.duration(diff);
      const years = moment().diff(
        moment(pV.date_of_birth, 'DD MMM YYYY'),
        'years',
      );
      const months = moment().diff(
        moment(pV.date_of_birth, 'DD MMM YYYY'),
        'months',
      );

      const days = moment().diff(
        moment(pV.date_of_birth, 'DD MMM YYYY'),
        'days',
      );

      if (years === 0 && months === 0) {
        return days === 0 ? 0 : `${days} days`;
      }

      return years === 0 ? `${months} months` : `${years} yrs`;
    }),
  );

  const search = async () => {
    try {
      const res = await database.getPatientsVisitedInDateRange(
        startDate,
        endDate,
      );

      console.log(res);
      setPatientVisits(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.main]}>
      <Header action={() => props.navigation.goBack()} />

      <View style={{padding: 18}}>
        <View
          style={{
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            paddingBottom: 28,
            borderBottomWidth: 1,
            marginBottom: 20,
            borderBottomColor: '#ccc',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
            }}>
            <Text style={{color: 'white'}}>From:</Text>
            <CustomDatePicker date={startDate} onDateChange={setStartDate} />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
            }}>
            <Text style={{color: 'white'}}>To:</Text>
            <CustomDatePicker date={endDate} onDateChange={setEndDate} />
          </View>
          <Pressable onPress={search}>
            <Text
              style={{padding: 8, backgroundColor: 'white', borderRadius: 8}}>
              Search
            </Text>
          </Pressable>
        </View>
        <Text style={{color: 'white', fontSize: 18}}>
          Total Overall Patients: {patientsCount}
        </Text>
        <Text style={{color: 'white', fontSize: 18, marginTop: 18}}>
          Total Patients Visits in time range: {patientVisits.length}
        </Text>

        <View style={{width: '75%', paddingTop: 24}}>
          {/* <Text>Sex</Text> */}
          <Text style={{color: 'white', fontSize: 18, marginBottom: 4}}>
            Sex Distributions:
          </Text>

          <Bars
            data={{Male: sexesCount['M'] || 0, Female: sexesCount['F'] || 0}}
          />

          <View style={{height: 24}} />
          <Text style={{color: 'white', fontSize: 18, marginBottom: 12}}>
            Age Distributions:
          </Text>
          <Bars data={ageDistribution} />
        </View>
      </View>
    </View>
  );
}

const Bars = ({data}: {[key: string]: number}) => {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  return (
    <View>
      {Object.keys(data).map((key) => (
        <View
          key={key}
          style={{display: 'flex', flexDirection: 'row', marginBottom: 8}}>
          <View style={{flex: 1}}>
            <Text style={{color: 'white'}}>{key}</Text>
          </View>
          <View style={{flex: 9}}>
            <Bar label="" val={data[key]} total={total} />
          </View>
        </View>
      ))}
    </View>
  );
};

const Bar = ({label = '', val = 0, total = 1}) => {
  return (
    <View style={{display: 'flex', flexDirection: 'row', paddingVertical: 2}}>
      <Text style={{color: 'white'}}>{label}</Text>
      <View style={{flex: 1, paddingLeft: 12}}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View
            style={{
              flex: Math.max(total === 0 ? 0 : val / total, 0.01),
              backgroundColor: 'green',
              marginRight: 10,
              borderRadius: 8,
            }}
          />
          <Text style={{color: 'white'}}>{val}</Text>
        </View>
      </View>
    </View>
  );
};
