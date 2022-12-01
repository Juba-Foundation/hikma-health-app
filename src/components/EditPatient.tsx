import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {v4 as uuid} from 'uuid';
import {database} from '../storage/Database';
import styles from './Style';
import DatePicker from 'react-native-datepicker';
import {LocalizedStrings} from '../enums/LocalizedStrings';
import {EventTypes} from '../enums/EventTypes';
import Header from './shared/Header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'EditPatient'>;

const EditPatient = (props: Props) => {
  const route = props.route;
  const {patient, language: lng = 'en'} = route.params;

  const [language, setLanguage] = useState(lng);
  const [givenNameText, setGivenNameText] = useState(
    !!route.params.patient.given_name
      ? route.params.patient.given_name.content[language]
      : '',
  );
  const [surnameText, setSurnameText] = useState(
    !!route.params.patient.surname
      ? route.params.patient.surname.content[language]
      : '',
  );
  const [dob, setDob] = useState(
    route.params.patient.date_of_birth == 'None'
      ? ''
      : route.params.patient.date_of_birth,
  );
  const [male, setMale] = useState(route.params.patient.sex === 'M');
  const [countryText, setCountryText] = useState(
    !!route.params.patient.country
      ? route.params.patient.country.content[language]
      : '',
  );
  const [hometownText, setHometownText] = useState(
    !!route.params.patient.hometown
      ? route.params.patient.hometown.content[language]
      : '',
  );
  const [phone, setPhone] = useState(route.params.patient.phone || '');
  const [camp, setCamp] = useState('');
  const today = new Date();

  const handleSaveCamp = (campName: string) => {
    database
      .addEvent({
        id: uuid(),
        patient_id: patient.id,
        visit_id: null,
        event_type: EventTypes.Camp,
        event_metadata: campName,
      })
      .then(() => console.log('camp saved'));
  };

  const editPatient = async () => {
    let givenNameId = !!patient.given_name ? patient.given_name.id : null;
    let surnameId = !!patient.surname ? patient.surname.id : null;
    let countryId = !!patient.country ? patient.country.id : null;
    let hometownId = !!patient.hometown ? patient.hometown.id : null;

    if (!!patient.given_name) {
      if (patient.given_name.content[language] !== undefined) {
        await database.editStringContent(
          [{language: language, content: givenNameText}],
          patient.given_name.id,
        );
      } else {
        await database.saveStringContent(
          [{language: language, content: givenNameText}],
          patient.given_name.id,
        );
      }
    } else {
      givenNameId = await database.saveStringContent([
        {language: language, content: givenNameText},
      ]);
    }

    if (!!patient.surname) {
      if (patient.surname.content[language] !== undefined) {
        await database.editStringContent(
          [{language: language, content: surnameText}],
          patient.surname.id,
        );
      } else {
        await database.saveStringContent(
          [{language: language, content: surnameText}],
          patient.surname.id,
        );
      }
    } else {
      surnameId = await database.saveStringContent([
        {language: language, content: surnameText},
      ]);
    }

    if (!!patient.country) {
      if (patient.country.content[language] !== undefined) {
        await database.editStringContent(
          [{language: language, content: countryText}],
          patient.country.id,
        );
      } else {
        await database.saveStringContent(
          [{language: language, content: countryText}],
          patient.country.id,
        );
      }
    } else {
      countryId = await database.saveStringContent([
        {language: language, content: countryText},
      ]);
    }

    if (!!patient.hometown) {
      if (patient.hometown.content[language] !== undefined) {
        await database.editStringContent(
          [{language: language, content: hometownText}],
          patient.hometown.id,
        );
      } else {
        await database.saveStringContent(
          [{language: language, content: hometownText}],
          patient.hometown.id,
        );
      }
    } else {
      hometownId = await database.saveStringContent([
        {language: language, content: hometownText},
      ]);
    }

    database
      .editPatient({
        id: patient.id,
        given_name: givenNameId || '',
        surname: surnameId || '',
        date_of_birth: dob,
        country: countryId || '',
        hometown: hometownId || '',
        phone: phone,
        sex: male ? 'M' : 'F',
      })
      .then((updatedPatient) =>
        props.navigation.navigate('PatientView', {
          patient: updatedPatient,
          language: language,
        }),
      );
  };

  useEffect(() => {
    setGivenNameText(
      !!patient.given_name ? patient.given_name.content[language] : '',
    );
    setSurnameText(!!patient.surname ? patient.surname.content[language] : '');
    setCountryText(!!patient.country ? patient.country.content[language] : '');
    setHometownText(
      !!patient.hometown ? patient.hometown.content[language] : '',
    );
  }, [language]);

  useEffect(() => {
    database
      .getLatestPatientEventByType(patient.id, EventTypes.Camp)
      .then((response: string) => {
        if (response.length > 0) {
          setCamp(response);
        }
      });
  }, []);

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
      {Header({
        action: () => props.navigation.navigate('PatientView', {language}),
        language,
        setLanguage,
      })}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].firstName}
          onChangeText={setGivenNameText}
          value={givenNameText}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].surname}
          onChangeText={setSurnameText}
          value={surnameText}
        />
      </View>
      <View style={styles.inputRow}>
        <DatePicker
          style={styles.datePicker}
          date={dob}
          mode="date"
          placeholder={LocalizedStrings[language].selectDob}
          format="YYYY-MM-DD"
          minDate="1900-05-01"
          maxDate={today.toISOString().split('T')[0]}
          confirmBtnText={LocalizedStrings[language].confirm}
          cancelBtnText={LocalizedStrings[language].cancel}
          customStyles={{
            dateInput: {
              alignItems: 'flex-start',
              borderWidth: 0,
            },
          }}
          androidMode="spinner"
          onDateChange={(date) => setDob(date)}
        />
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
          onChangeText={setCountryText}
          value={countryText}
        />
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].hometown}
          onChangeText={setHometownText}
          value={hometownText}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.inputs]}
          placeholder={LocalizedStrings[language].camp}
          onChangeText={(text) => {
            setCamp(text);
          }}
          onEndEditing={() => handleSaveCamp(camp)}
          value={camp}
        />
        <TextInput
          style={styles.inputs}
          placeholder={LocalizedStrings[language].phone}
          onChangeText={(text) => setPhone(text)}
          value={phone}
        />
      </View>
      <View style={{marginTop: 30}}>
        <Button
          title={LocalizedStrings[language].save}
          color={'#F77824'}
          onPress={() => editPatient()}
        />
      </View>
    </View>
  );
};

export default EditPatient;
