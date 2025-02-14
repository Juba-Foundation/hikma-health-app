import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import styles from './Style';
import {EventTypes} from '../enums/EventTypes';
import {database} from '../storage/Database';
import {v4 as uuid} from 'uuid';
import {LocalizedStrings} from '../enums/LocalizedStrings';
import moment from 'moment';
import Header from './shared/Header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigation';
import {CustomDatePicker} from './shared/CustomDatePicker';
import DatePicker from 'react-native-datepicker';
import {useLanguageStore} from '../stores/language';

type Props = NativeStackScreenProps<RootStackParamList, 'NewVisit'>;

const NewVisit = (props: Props) => {
  const {language} = useLanguageStore();
  const {patient, visitId, userName, existingVisit} = props.route?.params || {};
  const [visitType, setVisitType] = useState('');
  const [visitDate, setVisitDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [typeTextColor, setTypeTextColor] = useState('#A9A9A9');

  const today = new Date();

  useEffect(() => {
    let patientId = props.route?.params?.patient?.id;

    if (!patientId) return;
    database
      .getLatestPatientEventByType(patientId, EventTypes.VisitType)
      .then((response: string) => {
        if (response.length > 0) {
          setVisitType(response);
        }
      });
  }, [props]);

  const openTextEvent = (eventType: string) => {
    props.navigation.navigate('OpenTextEvent', {
      patientId: patient.id,
      visitId: visitId,
      eventType: eventType,
      language: language,
    });
  };

  const handleSaveVisitType = () => {
    database
      .addEvent({
        id: uuid(),
        patient_id: patient.id,
        visit_id: visitId,
        event_type: EventTypes.VisitType,
        event_metadata: visitType,
      })
      .then(() => console.log('visit type saved'));
  };

  return (
    <View style={styles.containerLeft}>
      <Header
        action={() =>
          existingVisit
            ? props.navigation.navigate('EventList', {patient})
            : props.navigation.navigate('PatientView', {patient})
        }
      />

      {existingVisit ? null : (
        <View style={styles.inputsContainer}>
          <View style={styles.inputRow}>
            <CustomDatePicker
              date={new Date(visitDate)}
              onDateChange={(d) => {
                setVisitDate(d.toISOString());
                database.editVisitDate(visitId, moment(d).toISOString());
              }}
            />
            <TextInput
              style={[styles.inputs, {color: typeTextColor}]}
              placeholder={LocalizedStrings[language].visitType}
              onChangeText={(text) => {
                setTypeTextColor('#000000');
                setVisitType(text);
              }}
              onEndEditing={handleSaveVisitType}
              value={visitType}
            />
          </View>
        </View>
      )}

      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            props.navigation.navigate('MedicalHistory', {
              patientId: patient.id,
              visitId,
              userName,
              language,
            })
          }>
          <View style={styles.actionIcon}>
            <Image
              source={require('../images/medicalHistory.png')}
              style={{width: 53, height: 51}}
            />
          </View>
          <Text style={styles.actionText}>
            {LocalizedStrings[language].medicalHistory}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openTextEvent(EventTypes.Complaint)}>
          <View style={styles.actionIcon}>
            <Image
              source={require('../images/complaint.png')}
              style={{width: 50, height: 50}}
            />
          </View>
          <Text style={styles.actionText}>
            {LocalizedStrings[language].complaint}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            props.navigation.navigate('Vitals', {
              patientId: patient.id,
              visitId,
              userName,
            })
          }>
          <View style={styles.actionIcon}>
            <Image
              source={require('../images/vitals.png')}
              style={{width: 66, height: 31}}
            />
          </View>
          <Text style={styles.actionText}>
            {LocalizedStrings[language].vitals}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            props.navigation.navigate('Examination', {
              patientId: patient.id,
              visitId,
              userName,
            })
          }>
          <View style={styles.actionIcon}>
            <Image
              source={require('../images/stethoscope.png')}
              style={{width: 43, height: 47}}
            />
          </View>
          <Text style={styles.actionText}>
            {LocalizedStrings[language].examination}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            props.navigation.navigate('Medicine', {
              patientId: patient.id,
              visitId,
              userName,
            })
          }>
          <View style={styles.actionIcon}>
            <Image
              source={require('../images/medicine.png')}
              style={{width: 77, height: 38}}
            />
          </View>
          <Text style={styles.actionText}>
            {LocalizedStrings[language].medicineDispensed}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            props.navigation.navigate('Physiotherapy', {
              patientId: patient.id,
              visitId,
              userName,
            })
          }>
          <View style={styles.actionIcon}>
            <Image
              source={require('../images/doctor.png')}
              style={{width: 40, height: 48}}
            />
          </View>
          <Text style={styles.actionText}>
            {LocalizedStrings[language].physiotherapy}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openTextEvent(EventTypes.DentalTreatment)}>
          <View style={styles.actionIcon}>
            <Image
              source={require('../images/dental_treatment.png')}
              style={{width: 50, height: 50}}
            />
          </View>
          <Text style={styles.actionText}>
            {LocalizedStrings[language].dentalTreatment}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openTextEvent(EventTypes.Notes)}>
          <View style={styles.actionIcon}>
            <Image
              source={require('../images/notes.png')}
              style={{width: 43, height: 47}}
            />
          </View>
          <Text style={styles.actionText}>
            {LocalizedStrings[language].notes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            props.navigation.navigate('Covid19Form', {
              patient,
              visitId,
              userName,
            })
          }>
          <View style={styles.actionIcon}>
            <Image
              source={require('../images/covid.png')}
              style={{width: 43, height: 47}}
            />
          </View>
          <Text style={styles.actionText}>
            {LocalizedStrings[language].covidScreening}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewVisit;
