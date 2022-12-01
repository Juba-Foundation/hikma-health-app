import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Button} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {database} from '../storage/Database';
import styles from './Style';
import {LocalizedStrings} from '../enums/LocalizedStrings';
import {EventTypes} from '../enums/EventTypes';
import {Event} from '../types/Event';
import {Covid19Display} from './Covid19Form';
import {VitalsDisplay} from './Vitals';
import {ExaminationDisplay} from './Examination';
import {MedicineDisplay} from './Medicine';
import {MedicalHistoryDisplay} from './MedicalHistory';
import {PhysiotherapyDisplay} from './Physiotherapy';
import Header from './shared/Header';
import {RootStackParamList} from '../navigation/RootNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useLanguageStore} from '../stores/language';

type Props = NativeStackScreenProps<RootStackParamList, 'EventList'>;

const EventList = (props: Props) => {
  const {language} = useLanguageStore();
  const {visit, patient, userName, events = []} = props.route.params;

  const [list, setList] = useState(events);

  useEffect(() => {
    if (visit) {
      database.getEvents(visit.id).then((events) => {
        const filteredEvents = events.filter((event) => {
          return !!event.event_metadata;
        });
        setList(filteredEvents);
      });
    }
  }, [props, language]);

  const keyExtractor = (item, index) => index.toString();

  const editEvent = (event: Event) => {
    switch (event.event_type) {
      case EventTypes.Vitals:
        props.navigation.navigate('EditVitals', {event, userName});
        break;
      case EventTypes.ExaminationFull:
        props.navigation.navigate('EditExamination', {
          event,
          language,
          userName,
        });
        break;
      case EventTypes.Medicine:
        props.navigation.navigate('EditMedicine', {event, language, userName});
        break;
      case EventTypes.MedicalHistoryFull:
        props.navigation.navigate('EditMedicalHistory', {
          event,
          language,
          userName,
        });
        break;
      case EventTypes.Physiotherapy:
        props.navigation.navigate('EditPhysiotherapy', {
          event,
          userName,
        });
        break;
      case EventTypes.Complaint:
      case EventTypes.DentalTreatment:
      case EventTypes.Notes:
        props.navigation.navigate('EditOpenTextEvent', {event});
      default:
        break;
    }
  };

  const renderItem = ({item}) => {
    const metadataObj = parseMetadata(item.event_metadata);
    let eventTypeText: string;
    let display;

    switch (item.event_type) {
      case EventTypes.Covid19Screening:
        eventTypeText = LocalizedStrings[language].covidScreening;
        display = Covid19Display(metadataObj, language);
        break;
      case EventTypes.Vitals:
        eventTypeText = LocalizedStrings[language].vitals;
        display = VitalsDisplay(metadataObj);
        break;
      case EventTypes.ExaminationFull:
        eventTypeText = LocalizedStrings[language].examination;
        display = ExaminationDisplay(metadataObj, language);
        break;
      case EventTypes.Medicine:
        eventTypeText = LocalizedStrings[language].medicine;
        display = MedicineDisplay(metadataObj, language);
        break;
      case EventTypes.MedicalHistoryFull:
        eventTypeText = LocalizedStrings[language].medicalHistory;
        display = MedicalHistoryDisplay(metadataObj, language);
        break;
      case EventTypes.Physiotherapy:
        eventTypeText = LocalizedStrings[language].physiotherapy;
        display = PhysiotherapyDisplay(metadataObj, language);
        break;
      default:
        eventTypeText = item.event_type;
        display = <Text>{metadataObj}</Text>;
        break;
    }
    const time = new Date(item.event_timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return (
      <TouchableOpacity style={styles.card} onLongPress={() => editEvent(item)}>
        <View style={styles.cardContent}>
          <View style={{margin: 10}}>
            <Text>{`${eventTypeText}, ${time}`}</Text>
            <View
              style={{
                marginVertical: 5,
                borderBottomColor: 'black',
                borderBottomWidth: 1,
              }}
            />
            {display}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const parseMetadata = (metadata: string) => {
    try {
      JSON.parse(metadata);
    } catch (e) {
      return metadata;
    }
    return JSON.parse(metadata);
  };

  return (
    <View style={styles.main}>
      <Header
        action={() =>
          props.navigation.navigate('VisitList', {
            patient: patient,
            userName,
          })
        }
      />
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Text style={styles.text}>
          {visit?.check_in_timestamp?.split('T')[0]} ({list.length})
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
      <View style={{position: 'absolute', bottom: 20, right: 20}}>
        <Button
          title={LocalizedStrings[language].newEntry}
          color={'#F77824'}
          onPress={() => {
            props.navigation.navigate('NewVisit', {
              patient: patient,
              visitId: visit.id,
              userName: userName,
              existingVisit: true,
            });
          }}
        />
      </View>
    </View>
  );
};

export default EventList;
