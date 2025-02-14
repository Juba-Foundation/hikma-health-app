import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
} from 'react-native';
import {database} from '../storage/Database';
import styles from './Style';
import {v4 as uuid} from 'uuid';
import {EventTypes} from '../enums/EventTypes';
import {iconHash} from '../services/hash';
import {User} from '../types/User';
import {LocalizedStrings} from '../enums/LocalizedStrings';
import UserAvatar from 'react-native-user-avatar';
import Header from './shared/Header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigation';
import {useLanguageStore} from '../stores/language';

type Props = NativeStackScreenProps<RootStackParamList, 'PatientView'>;

const PatientView = (props: Props) => {
  const params = props.route.params;
  const {language} = useLanguageStore();

  const [patient, setPatient] = useState(params.patient);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [userName, setUserName] = useState('');
  const [summary, setSummary] = useState(LocalizedStrings[language].noContent);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const clinicId = params.clinicId;
  const userId = params.userId;
  const name1 = 'This';
  const name2 = 'Guy';

  const reloadPatientsToggle = params.reloadPatientsToggle || false;

  useEffect(() => {
    setPatient(props.route.params.patient);
    let patientId = props.route.params.patient.id;
    database
      .getLatestPatientEventByType(patientId, EventTypes.PatientSummary)
      .then((response: string) => {
        if (response.length > 0) {
          setSummary(response);
        } else {
          setSummary(LocalizedStrings[language].noContent);
        }
      });
  }, [props, language]);

  useEffect(() => {
    database.getUser(userId).then((user: User) => {
      if (!!user.name.content[language]) {
        setUserName(user.name.content[language]);
      } else {
        setUserName(user.name.content[Object.keys(user.name.content)[0]]);
      }
    });
  }, []);

  const displayName = (patient) => {
    if (
      !!patient.given_name.content[language] &&
      !!patient.surname.content[language]
    ) {
      return (
        <Text>{`${patient.given_name.content[language]} ${patient.surname.content[language]}`}</Text>
      );
    } else {
      patient.given_name.content[Object.keys(patient.given_name.content)[0]];
      return (
        <Text>{`${
          patient.given_name.content[Object.keys(patient.given_name.content)[0]]
        } ${
          patient.surname.content[Object.keys(patient.surname.content)[0]]
        }`}</Text>
      );
    }
  };

  const displayNameAvatar = (patient) => {
    if (
      !!patient.given_name.content[language] &&
      !!patient.surname.content[language]
    ) {
      return `${patient.given_name.content[language]} ${patient.surname.content[language]}`;
    } else {
      patient.given_name.content[Object.keys(patient.given_name.content)[0]];
      return `${
        patient.given_name.content[Object.keys(patient.given_name.content)[0]]
      } ${patient.surname.content[Object.keys(patient.surname.content)[0]]}`;
    }
  };

  const handleSaveSummary = () => {
    database
      .addEvent({
        id: uuid(),
        patient_id: patient.id,
        visit_id: null,
        event_type: EventTypes.PatientSummary,
        event_metadata: summary,
      })
      .then(() => console.log('patient summary saved'));
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={[styles.main, {justifyContent: 'space-between'}]}>
        <Header
          action={() =>
            props.navigation.navigate('PatientList', {
              reloadPatientsToggle: !reloadPatientsToggle,
            })
          }
        />
        <View style={[styles.card, {flex: 1, elevation: 0}]}>
          <View style={[styles.cardContent, {alignItems: 'flex-start'}]}>
            <UserAvatar
              size={100}
              name={displayNameAvatar(patient)}
              bgColor="#ECECEC"
              textColor="#6177B7"
            />
            <View style={{marginLeft: 20, flex: 1}}>
              <View style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Text style={styles.gridItemText}>
                    {displayName(patient)}
                  </Text>
                  <View style={[styles.editPatientButton]}>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('EditPatient', {
                          patient: patient,
                        })
                      }>
                      <Text style={{color: '#FFFFFF'}}>
                        {LocalizedStrings[language].edit}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{flex: 1}}>
                <Text>{`${LocalizedStrings[language].serialNumber}:  ${patient.serial_number}`}</Text>
                <Text>{`${LocalizedStrings[language].dob}:  ${patient.date_of_birth}`}</Text>
                <Text>{`${LocalizedStrings[language].sex}:  ${patient.sex}`}</Text>
                <Text>{`${LocalizedStrings[language].camp}:  ${patient.camp}`}</Text>
                <Text>{`${LocalizedStrings[language].section}:  ${
                  patient.section.content[
                    Object.keys(patient.given_name.content)[0]
                  ]
                }`}</Text>
              </View>

              <View style={{flex: 1, marginBottom: 15}}>
                <TouchableOpacity onLongPress={() => setIsEditingSummary(true)}>
                  {isEditingSummary ? (
                    <View>
                      <TextInput
                        style={styles.paragraph}
                        onChangeText={setSummary}
                        value={summary}
                      />
                      <TouchableOpacity
                        style={[
                          styles.editPatientButton,
                          {marginHorizontal: 0},
                        ]}
                        onPress={() => {
                          handleSaveSummary();
                          setIsEditingSummary(false);
                        }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{color: '#FFFFFF'}}>
                            {LocalizedStrings[language].save}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <Text style={[styles.gridItemText, {paddingBottom: 5}]}>
                        {LocalizedStrings[language].patientSummary}
                      </Text>
                      <Text style={[styles.paragraph]}>{summary}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={{alignItems: 'stretch', flex: 1}}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() =>
              props.navigation.navigate('VisitList', {
                language: language,
                patient: patient,
                userName,
              })
            }>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <Text style={styles.gridItemText}>
                {LocalizedStrings[language].visitHistory}
              </Text>
              <Text style={styles.gridItemText}>{`>`}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() =>
              props.navigation.navigate('SnapshotList', {
                eventType: EventTypes.MedicalHistoryFull,
                patient: patient,
              })
            }>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <Text style={styles.gridItemText}>
                {LocalizedStrings[language].medicalHistory}
              </Text>
              <Text style={styles.gridItemText}>{`>`}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() =>
              props.navigation.navigate('SnapshotList', {
                eventType: EventTypes.Complaint,
                patient: patient,
              })
            }>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <Text style={styles.gridItemText}>
                {LocalizedStrings[language].complaint}
              </Text>
              <Text style={styles.gridItemText}>{`>`}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() =>
              props.navigation.navigate('SnapshotList', {
                eventType: EventTypes.ExaminationFull,
                patient: patient,
              })
            }>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <Text style={styles.gridItemText}>
                {LocalizedStrings[language].examination}
              </Text>
              <Text style={styles.gridItemText}>{`>`}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() =>
              props.navigation.navigate('SnapshotList', {
                eventType: EventTypes.Medicine,
                patient: patient,
              })
            }>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <Text style={styles.gridItemText}>
                {LocalizedStrings[language].medicine}
              </Text>
              <Text style={styles.gridItemText}>{`>`}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.newVisit}>
          <Button
            title={LocalizedStrings[language].newVisit}
            color={'#F77824'}
            onPress={() => {
              const newVisitId = uuid();
              database.addVisit({
                id: newVisitId,
                patient_id: patient.id,
                clinic_id: clinicId,
                provider_id: userId,
              });
              props.navigation.navigate('NewVisit', {
                patient: patient,
                visitId: newVisitId.replace(/-/g, ''),
                userName: userName,
              });
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default PatientView;
