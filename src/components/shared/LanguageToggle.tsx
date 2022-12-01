import React from 'react';
import {Picker} from '@react-native-picker/picker';
import styles from '../Style';
import {useLanguageStore} from '../../stores/language';

const LanguageToggle = (props) => {
  const {language, setLanguage} = useLanguageStore();
  return (
    <Picker
      selectedValue={language}
      // onValueChange={(value) => props.setLanguage(value)}
      onValueChange={setLanguage}
      style={{width: 100, color: '#fff'}}>
      <Picker.Item value="en" label="En" />
      <Picker.Item value="ar" label="Ar" />
    </Picker>
  );
};

export default LanguageToggle;
