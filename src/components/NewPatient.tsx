import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Button,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {database} from '../storage/Database';
import {v4 as uuid} from 'uuid';
import styles from './Style';
import * as PatientTypes from '../types/Patient';
// import DatePicker from 'react-native-date-picker';
import {LocalizedStrings} from '../enums/LocalizedStrings';
import {EventTypes} from '../enums/EventTypes';
import Header from './shared/Header';
import {CustomDatePicker} from './shared/CustomDatePicker';
import moment from 'moment';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigation';
import {useLanguageStore} from '../stores/language';
import {useProviderStore} from '../stores/provider';

type Props = NativeStackScreenProps<RootStackParamList, 'NewPatient'>;

const DEFAULT_DOB = (() => {
  // set year, month and date separately to support HERMES engine
  const d = new Date();
  d.setFullYear(1990);
  d.setMonth(0), d.setDate(1);
  return d;
})();

const NewPatient = (props: Props) => {
  const {language} = useLanguageStore();
  const {provider} = useProviderStore();

  const [givenName, setGivenName] = useState('');
  const [surname, setSurname] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [dob, setDob] = useState(DEFAULT_DOB);
  const [male, setMale] = useState(false);
  const [country, setCountry] = useState('');
  const [hometown, setHometown] = useState('');
  const [phone, setPhone] = useState('');
  const [camp, setCamp] = useState('');
  const [section, setSection] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const [patientId] = useState(uuid().replace(/-/g, ''));

  console.warn({instanceUrl: props.route.params.instanceUrl});

  const handleSaveCamp = (campName: string) => {
    database
      .addEvent({
        id: uuid(),
        patient_id: patientId,
        visit_id: null,
        event_type: EventTypes.Camp,
        event_metadata: campName,
      })
      .then(() => console.log('camp saved'));
  };

  const addPatient = async () => {
    // TODO: replace alert texts with translated texts
    if (loading) return;
    if (givenName.length === 0 || surname.length === 0) {
      return Alert.alert(
        'Empty name provided. Please fill in both given name and surname',
      );
    }
    try {
      const givenNameId = await database.saveStringContent([
        {language: language, content: givenName},
      ]);
      const surnameId = await database.saveStringContent([
        {language: language, content: surname},
      ]);
      const countryId = await database.saveStringContent([
        {language: language, content: country},
      ]);
      const hometownId = await database.saveStringContent([
        {language: language, content: hometown},
      ]);
      const sectionId = await database.saveStringContent([
        {language: language, content: section},
      ]);

      const patient: PatientTypes.NewPatient = {
        id: patientId,
        given_name: givenNameId,
        surname: surnameId,
        date_of_birth: moment().format('YYYY-MM-DD'),
        country: countryId,
        hometown: hometownId,
        section: sectionId,
        serial_number: serialNumber,
        phone: phone,
        registered_by_provider_id: provider?.id || '',
        sex: male ? 'M' : 'F',
      };

      database.addPatient(patient).then(() => {
        if (!!camp) {
          handleSaveCamp(camp);
        }
        props.navigation.goBack();
        // props.navigation.navigate('PatientList', {
        //   reloadPatientsToggle: !props.route?.params?.reloadPatientsToggle,
        //   instanceUrl: props.route.params.instanceUrl,
        // });
      });
    } catch (error) {
      Alert.alert('An error occured. Please try again.');
      console.error(error);
    }
  };

  function RadioButton(props) {
    return (
      <TouchableOpacity onPress={() => setMale(!male)}>
        <View style={styles.outerRadioButton}>
          {props.selected ? <View style={styles.selectedRadioButton} /> : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        action={() =>
          props.navigation.navigate('PatientList', {
            instanceUrl: props.route.params.instanceUrl,
          })
        }
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].firstName}
          onChangeText={(text) => setGivenName(text)}
          value={givenName}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].surname}
          onChangeText={(text) => setSurname(text)}
          value={surname}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].serialNumber}
          onChangeText={(text) => setSerialNumber(text)}
          value={serialNumber}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].phone}
          onChangeText={(text) => setPhone(text)}
          value={phone}
        />
      </View>
      <View style={styles.inputRow}>
        <CustomDatePicker date={dob} onDateChange={setDob} />
        <View>
          <Text style={[{color: '#FFFFFF'}]}>
            {LocalizedStrings[language].gender}
          </Text>
          <View style={[{flexDirection: 'row'}]}>
            {RadioButton({selected: male})}
            <Text style={[{color: '#FFFFFF', paddingHorizontal: 5}]}>M</Text>
            {RadioButton({selected: !male})}
            <Text style={[{color: '#FFFFFF', paddingHorizontal: 5}]}>F</Text>
          </View>
        </View>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].country}
          onChangeText={(text) => setCountry(text)}
          value={country}
        />
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].hometown}
          onChangeText={(text) => setHometown(text)}
          value={hometown}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.inputs]}
          placeholder={LocalizedStrings[language].camp}
          onChangeText={(text) => {
            setCamp(text);
          }}
          value={camp}
        />
        <TextInput
          style={[styles.inputs]}
          placeholder={LocalizedStrings[language].section}
          onChangeText={(text) => {
            setSection(text);
          }}
          value={section}
        />
      </View>
      <View style={{marginTop: 30}}>
        <Button
          title={LocalizedStrings[language].save}
          color={'#F77824'}
          onPress={() => addPatient()}
        />
      </View>
    </View>
  );
};

export default NewPatient;
