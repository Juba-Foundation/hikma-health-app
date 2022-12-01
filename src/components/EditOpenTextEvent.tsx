import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Button} from 'react-native';

import {database} from '../storage/Database';
import styles from './Style';
import {LocalizedStrings} from '../enums/LocalizedStrings';
import Header from './shared/Header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'EditOpenTextEvent'>;

const EditOpenTextEvent = (props: Props) => {
  const {language: lng = 'en', event} = props.route.params;

  const [language, setLanguage] = useState(lng);
  const [responseText, setResponseText] = useState(event.event_metadata);

  const editEvent = async () => {
    database.editEvent(event.id, responseText).then((response) => {
      props.navigation.navigate('EventList', {events: response, language});
    });
  };

  return (
    <View style={styles.container}>
      {Header({
        action: () => props.navigation.navigate('EventList', {language}),
        language,
        setLanguage,
      })}
      <Text style={[styles.text, {fontSize: 16, fontWeight: 'bold'}]}>
        {event.event_type}
      </Text>
      <TextInput
        style={styles.loginInputsContainer}
        placeholder={LocalizedStrings[language].enterTextHere}
        onChangeText={setResponseText}
        value={responseText}
        multiline={true}
      />

      <View style={{alignItems: 'center'}}>
        <Button
          title={LocalizedStrings[language].save}
          color={'#F77824'}
          onPress={() => editEvent()}
        />
      </View>
    </View>
  );
};

export default EditOpenTextEvent;
