import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  TouchableOpacity,
} from 'react-native';

import {database} from '../storage/Database';
import styles from './Style';
import {LocalizedStrings} from '../enums/LocalizedStrings';
import radioButtons from './shared/RadioButtons';
import Header from './shared/Header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigation';
import {useLanguageStore} from '../stores/language';

type Props = NativeStackScreenProps<RootStackParamList, 'Examination'>;

const EditPhysiotherapy = (props) => {
  const {language} = useLanguageStore();
  const {event, userName} = props.route.params;

  const [previousTreatment, setPreviousTreatment] = useState(null);
  const [previousTreatmentText, setPreviousTreatmentText] = useState(null);
  const [complaint, setComplaint] = useState(null);
  const [findings, setFindings] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [treatmentSession, setTreatmentSession] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [referral, setReferral] = useState(null);
  const [referralText, setReferralText] = useState(null);

  useEffect(() => {
    if (!!event.event_metadata) {
      const metadataObj = JSON.parse(event.event_metadata);
      setPreviousTreatment(metadataObj.previousTreatment);
      setPreviousTreatmentText(metadataObj.previousTreatmentText);
      setComplaint(metadataObj.complaint);
      setFindings(metadataObj.findings);
      setTreatmentPlan(metadataObj.treatmentPlan);
      setTreatmentSession(metadataObj.treatmentSession);
      setReferral(metadataObj.referral);
      setReferralText(metadataObj.referralText);
      setRecommendations(metadataObj.recommendations);
    }
  }, [props]);

  const submit = async () => {
    database
      .editEvent(
        event.id,
        JSON.stringify({
          doctor: userName,
          previousTreatment,
          previousTreatmentText,
          complaint,
          findings,
          treatmentPlan,
          treatmentSession,
          recommendations,
          referral,
          referralText,
        }),
      )
      .then((response) =>
        props.navigation.navigate('EventList', {events: response}),
      );
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.containerLeft}>
        <Header action={() => props.navigation.navigate('EventList', {})} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignSelf: 'stretch',
          }}>
          <Text style={[styles.text, {fontSize: 16, fontWeight: 'bold'}]}>
            {LocalizedStrings[language].physiotherapy}
          </Text>
        </View>

        <View style={styles.responseRow}>
          {radioButtons({
            field: previousTreatment,
            action: setPreviousTreatment,
            prompt: LocalizedStrings[language].previousTreatment,
            language,
          })}
        </View>
        {!!previousTreatment ? (
          <View
            style={[styles.responseRow, {paddingTop: 0, paddingHorizontal: 0}]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setPreviousTreatmentText(text)}
              value={previousTreatmentText}
            />
          </View>
        ) : null}
        <View style={[styles.responseRow, {paddingBottom: 0}]}>
          <Text style={{color: '#FFFFFF'}}>
            {LocalizedStrings[language].complaint}
          </Text>
        </View>
        <View style={[styles.responseRow, {padding: 0}]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setComplaint(text)}
            value={complaint}
          />
        </View>
        <View style={[styles.responseRow, {paddingVertical: 0}]}>
          <Text style={{color: '#FFFFFF'}}>
            {LocalizedStrings[language].findings}
          </Text>
        </View>
        <View style={[styles.responseRow, {padding: 0}]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setFindings(text)}
            value={findings}
          />
        </View>
        <View style={[styles.responseRow, {paddingVertical: 0}]}>
          <Text style={{color: '#FFFFFF'}}>
            {LocalizedStrings[language].treatmentPlan}
          </Text>
        </View>
        <View style={[styles.responseRow, {padding: 0}]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setTreatmentPlan(text)}
            value={treatmentPlan}
          />
        </View>
        <View style={[styles.responseRow, {paddingVertical: 0}]}>
          <Text style={{color: '#FFFFFF'}}>
            {LocalizedStrings[language].treatmentSession}
          </Text>
        </View>
        <View style={[styles.responseRow, {padding: 0}]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setTreatmentSession(text)}
            value={treatmentSession}
          />
        </View>
        <View style={[styles.responseRow, {paddingVertical: 0}]}>
          <Text style={{color: '#FFFFFF'}}>
            {LocalizedStrings[language].recommendations}
          </Text>
        </View>
        <View
          style={[styles.responseRow, {paddingTop: 0, paddingHorizontal: 0}]}>
          <TextInput
            style={styles.inputs}
            onChangeText={(text) => setRecommendations(text)}
            value={recommendations}
          />
        </View>
        <View style={styles.responseRow}>
          {radioButtons({
            field: referral,
            action: setReferral,
            prompt: LocalizedStrings[language].referral,
            language,
          })}
        </View>
        {!!referral ? (
          <View
            style={[styles.responseRow, {paddingTop: 0, paddingHorizontal: 0}]}>
            <TextInput
              style={styles.inputs}
              onChangeText={(text) => setReferralText(text)}
              value={referralText}
            />
          </View>
        ) : null}
        <View style={{alignItems: 'center'}}>
          <Button
            title={LocalizedStrings[language].save}
            color={'#F77824'}
            onPress={() => submit()}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditPhysiotherapy;
