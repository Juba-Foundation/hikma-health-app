import React, {FC} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from '../Style';
import {LocalizedStrings} from '../../enums/LocalizedStrings';
import LanguageToggle from './LanguageToggle';
import {useLanguageStore} from '../../stores/language';

type HeaderProps = {
  action: () => void;
};

// TODO: Is it necessary to pass the "back" action if its always poping the navigation stack?

const Header: FC<HeaderProps> = (props) => {
  const {language} = useLanguageStore();
  return (
    <View style={[styles.searchBar, {display: 'flex', marginBottom: 10}]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          flex: 1,
          display: 'flex',
        }}>
        <View style={[styles.card]}>
          <TouchableOpacity onPress={() => props.action()}>
            <Text>{LocalizedStrings[language].back}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          display: 'flex',
        }}>
        <Image
          source={require('../../images/logo_no_text.png')}
          style={{width: 60, height: 60}}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}>
        <LanguageToggle />
      </View>
    </View>
  );
};
export default Header;
