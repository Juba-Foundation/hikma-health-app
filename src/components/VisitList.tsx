import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {database} from '../storage/Database';
import styles from './Style';
import {LocalizedStrings} from '../enums/LocalizedStrings';
import {Visit} from '../types/Visit';
import Header from './shared/Header';
import {RootStackParamList} from '../navigation/RootNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useLanguageStore} from '../stores/language';

type Props = NativeStackScreenProps<RootStackParamList, 'VisitList'>;

const VisitList = (props: Props) => {
  const {language} = useLanguageStore();
  const {patient, userName} = props.route.params;

  const [list, setList] = useState<Visit[]>([]);

  useEffect(() => {
    database.getVisits(patient.id).then((visits) => {
      setList(visits);
    });
    // FIXME: Why is this db call dependent on language?
  }, [props, language]);

  const keyExtractor = (item, index) => index.toString();

  const deleteVisit = (visit: Visit) => {
    database.deleteVisit(visit.id, patient.id).then((visits) => {
      setList(visits);
    });
  };

  const displayPatientName = (item) => {
    if (
      !!item.given_name.content[language] &&
      !!item.surname.content[language]
    ) {
      return (
        <Text>{`${item.given_name.content[language]} ${item.surname.content[language]}`}</Text>
      );
    } else {
      return (
        <Text>{`${
          item.given_name.content[Object.keys(item.given_name.content)[0]]
        } ${item.surname.content[Object.keys(item.surname.content)[0]]}`}</Text>
      );
    }
  };

  const displayProviderName = (item) => {
    if (!!item.provider_name.content[language]) {
      return (
        <Text>{`${LocalizedStrings[language].provider}: ${item.provider_name.content[language]}`}</Text>
      );
    } else {
      return (
        <Text>{`${LocalizedStrings[language].provider}: ${
          item.provider_name.content[Object.keys(item.provider_name.content)[0]]
        }`}</Text>
      );
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        props.navigation.navigate('EventList', {
          patient,
          userName,
          visit: item,
        })
      }
      onLongPress={() =>
        Alert.alert(
          'Delete Visit',
          'Are you sure you want to delete this visit?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Confirm',
              onPress: () => {
                deleteVisit(item);
              },
            },
          ],
        )
      }>
      <View style={styles.cardContent}>
        <View style={{margin: 10}}>
          {displayPatientName(patient)}
          <View
            style={{
              marginVertical: 5,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          {displayProviderName(item)}
          <Text>{`${LocalizedStrings[language].visitDate}: ${
            item.check_in_timestamp.split('T')[0]
          }`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.main}>
      <Header
        action={() =>
          props.navigation.navigate('PatientView', {
            patient: patient,
          })
        }
      />
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Text style={styles.text}>
          {LocalizedStrings[language].visitHistory} ({list.length})
        </Text>
      </View>
      <View style={styles.listContainer}>
        <View style={styles.scroll}>
          <FlatList
            keyExtractor={keyExtractor}
            data={list}
            renderItem={(item) => renderItem(item)}
          />
        </View>
      </View>
    </View>
  );
};

export default VisitList;
