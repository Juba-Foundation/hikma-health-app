import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image as Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  Modal,
  TouchableHighlight,
  Button,
  ViewStyle,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {database} from '../storage/Database';
import {DatabaseSync} from '../storage/Sync';
import styles from './Style';
import {iconHash} from '../services/hash';
import {LocalizedStrings} from '../enums/LocalizedStrings';
import UserAvatar from 'react-native-user-avatar';
import LanguageToggle from './shared/LanguageToggle';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootNavigation';
import {useLanguageStore} from '../stores/language';
import {useIsFocused} from '@react-navigation/native';
// import {useProviderStore} from '../stores/provider';

type Props = NativeStackScreenProps<RootStackParamList, 'PatientList'>;

const PatientList = (props: Props) => {
  const databaseSync: DatabaseSync = new DatabaseSync();
  const isFocused = useIsFocused();
  // const {provider} = useProviderStore();
  const {email, password, clinicId, instanceUrl} = props.route.params;
  const [userId, setUserId] = useState(props.route.params.userId);
  const [list, setList] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [givenName, setGivenName] = useState('');
  const [surname, setSurname] = useState('');
  const [country, setCountry] = useState('');
  const [hometown, setHometown] = useState('');
  const [camp, setCamp] = useState('');
  const [phone, setPhone] = useState('');
  const [minAge, setMinAge] = useState<number>(0);
  const [maxAge, setMaxAge] = useState<number>(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [searchIconFunction, setSearchIconFunction] = useState(false);
  const search = useRef(null);

  const {language} = useLanguageStore();

  useEffect(() => {
    if (isFocused) {
      searchPatients();
    }
  }, [props.route.params.reloadPatientsToggle, language, isFocused]);

  const keyExtractor = (item, index) => index.toString();

  const reloadPatients = () => {
    database.getPatients().then((patients) => {
      setList(patients);
      setGivenName('');
      setSurname('');
      setCountry('');
      setHometown('');
      setCamp('');
      setPhone('');
      setMinAge(0);
      setMaxAge(0);
    });
    database.getPatientCount().then((number) => setPatientCount(number));
  };

  const searchPatients = () => {
    const currentYear = new Date().getFullYear();
    if (
      givenName.length > 0 ||
      surname.length > 0 ||
      country.length > 0 ||
      hometown.length > 0 ||
      maxAge > 0 ||
      camp.length > 0 ||
      phone.length > 0
    ) {
      const givenNameLC = givenName.toLowerCase();
      const surnameLC = surname.toLowerCase();
      const countryLC = country.toLowerCase();
      const hometownLC = hometown.toLowerCase();
      const campLC = camp.toLowerCase();
      const phoneLC = phone.toLowerCase();
      const minYear =
        maxAge > 0 && maxAge >= minAge ? currentYear - maxAge : null;
      const maxYear =
        maxAge > 0 && maxAge >= minAge ? currentYear - minAge : null;

      database
        .searchPatients(
          givenNameLC,
          surnameLC,
          countryLC,
          hometownLC,
          campLC,
          phoneLC,
          minYear,
          maxYear,
        )
        .then((patients) => {
          setList(patients);
        });
    } else {
      reloadPatients();
    }
    setSearchIconFunction(false);
  };

  const agePicker = () => {
    let ages = [];
    let i = 0;
    for (i; i < 110; i++) {
      ages.push(<Picker.Item key={i} value={i} label={i.toString()} />);
    }
    return ages;
  };

  const logout = () => {
    setUserId('');
    props.navigation.navigate('Home', {logout: true});
  };

  const displayName = (item) => {
    if (
      !!item.given_name.content[language] &&
      !!item.surname.content[language]
    ) {
      return (
        <Text>{`${item.given_name.content[language]} ${item.surname.content[language]}`}</Text>
      );
    } else {
      item.given_name.content[Object.keys(item.given_name.content)[0]];
      return (
        <Text>{`${
          item.given_name.content[Object.keys(item.given_name.content)[0]]
        } ${item.surname.content[Object.keys(item.surname.content)[0]]}`}</Text>
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

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        props.navigation.navigate('PatientView', {
          language: language,
          patient: item,
          reloadPatientsToggle: props.route.params.reloadPatientsToggle,
          clinicId: clinicId,
          userId: userId,
        })
      }>
      <View style={styles.cardContent}>
        <UserAvatar
          size={100}
          name={displayNameAvatar(item)}
          bgColor="#ECECEC"
          textColor="#6177B7"
        />
        <View style={{flexShrink: 1, marginLeft: 20}}>
          {displayName(item)}
          <View
            style={{
              marginVertical: 5,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          <Text
            style={{
              flexWrap: 'wrap',
            }}>{`${LocalizedStrings[language].dob}:  ${item.date_of_birth}`}</Text>
          <Text>{`${LocalizedStrings[language].sex}:  ${item.sex}`}</Text>
          <Text>{`${LocalizedStrings[language].camp}:  ${item.camp}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.main}>
      <View style={styles.listContainer}>
        <View style={[styles.searchBar, {display: 'flex', marginBottom: 5}]}>
          {/* TODO: fix header to look better */}
          <View style={[styles.card, {paddingVertical: 3}]}>
            <TouchableOpacity onPress={() => logout()}>
              <Text>{LocalizedStrings[language].logOut}</Text>
            </TouchableOpacity>
          </View>

          <LanguageToggle />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('SummaryStats')}
              style={{
                backgroundColor: '#fff',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}>
              <Text>Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await databaseSync.performSync(
                  instanceUrl,
                  email,
                  password,
                  language,
                );
                reloadPatients();
              }}>
              <View
                style={[
                  styles.card,
                  {flexDirection: 'row', alignItems: 'center'},
                ]}>
                <Text>{LocalizedStrings[language].sync}</Text>
                <Image
                  source={require('../images/sync.png')}
                  style={{width: 15, height: 15, marginLeft: 5}}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.searchBar,
            {backgroundColor: '#6177B7', borderRadius: 30},
          ]}>
          <TextInput
            style={[styles.searchInput, {marginLeft: 10}]}
            placeholderTextColor="#FFFFFF"
            placeholder={LocalizedStrings[language].patientSearch}
            onChangeText={(text) => setGivenName(text)}
            onEndEditing={searchPatients}
            onFocus={() => setSearchIconFunction(true)}
            value={givenName}
            ref={search}
          />
          <TouchableOpacity
            onPress={() => {
              if (searchIconFunction) {
                searchPatients();
                Keyboard.dismiss();
              } else {
                search.current.focus();
                setSearchIconFunction(true);
              }
            }}>
            <Image
              source={require('../images/search.jpg')}
              style={{width: 30, height: 30, marginRight: 10}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.searchBar,
            {marginTop: 0, justifyContent: 'space-around'},
          ]}>
          <Text style={styles.text}>
            {patientCount} {LocalizedStrings[language].patients}
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <Text style={{color: '#FFFFFF'}}>
              {LocalizedStrings[language].advancedFilters}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reloadPatients()}>
            <Text style={{color: '#FFFFFF'}}>
              {LocalizedStrings[language].clearFilters}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scroll}>
          <FlatList
            keyExtractor={keyExtractor}
            data={list}
            renderItem={(item) => renderItem(item)}
          />
        </View>

        <View style={{position: 'absolute', bottom: 20, right: 20}}>
          <Button
            title={LocalizedStrings[language].newPatient}
            color={'#F77824'}
            onPress={() =>
              props.navigation.navigate('NewPatient', {
                reloadPatientsToggle: props.route.params.reloadPatientsToggle,
                instanceUrl,
              })
            }
          />
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={!true}
        hardwareAccelerated
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.leftView}>
          <View
            style={[
              styles.modalView,
              {alignItems: 'stretch', justifyContent: 'space-between'},
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: -24,
                marginBottom: 20,
              }}>
              <Text style={{fontSize: 24}}>Advanced Filters</Text>
              <TouchableHighlight
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setSearchIconFunction(true);
                }}>
                <Image
                  source={require('../images/close.png')}
                  style={{width: 20, height: 20}}
                />
              </TouchableHighlight>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TextInput
                placeholder={LocalizedStrings[language].firstName}
                onChangeText={(text) => setGivenName(text)}
                style={INPUT_CONTAINER_L}
                value={givenName}
              />
              <TextInput
                placeholder={LocalizedStrings[language].surname}
                onChangeText={(text) => setSurname(text)}
                style={INPUT_CONTAINER_R}
                value={surname}
              />
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TextInput
                placeholder={LocalizedStrings[language].country}
                style={INPUT_CONTAINER_L}
                onChangeText={(text) => setCountry(text)}
                value={country}
              />
              <TextInput
                placeholder={LocalizedStrings[language].hometown}
                style={INPUT_CONTAINER_R}
                onChangeText={(text) => setHometown(text)}
                value={hometown}
              />
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TextInput
                placeholder={LocalizedStrings[language].camp}
                style={INPUT_CONTAINER_L}
                onChangeText={(text) => setCamp(text)}
                value={camp}
              />
              <TextInput
                placeholder={LocalizedStrings[language].phone}
                style={INPUT_CONTAINER_R}
                onChangeText={(text) => setPhone(text)}
                value={phone}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text style={{paddingTop: 15, paddingRight: 5}}>
                {LocalizedStrings[language].minAge}
              </Text>
              <Picker
                selectedValue={minAge}
                onValueChange={(value) => setMinAge(value)}
                style={{
                  height: 50,
                  width: 90,
                }}>
                {agePicker()}
              </Picker>
              <Text style={{paddingTop: 15, paddingRight: 5, paddingLeft: 5}}>
                {LocalizedStrings[language].maxAge}
              </Text>
              <Picker
                selectedValue={maxAge}
                onValueChange={(value) => setMaxAge(value)}
                style={{
                  height: 50,
                  width: 90,
                }}>
                {agePicker()}
              </Picker>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button
                title={LocalizedStrings[language].clearFilters}
                color={'red'}
                onPress={() => {
                  reloadPatients();
                }}></Button>
              <Button
                title={LocalizedStrings[language].search}
                onPress={() => {
                  Keyboard.dismiss();
                  setModalVisible(!modalVisible);
                  searchPatients();
                }}></Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const INPUT_CONTAINER: ViewStyle = {
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#ccc',
  flex: 1,
  padding: 8,
  marginBottom: 10,
};

const INPUT_CONTAINER_L: ViewStyle = {
  ...INPUT_CONTAINER,
  marginRight: 4,
};

const INPUT_CONTAINER_R: ViewStyle = {
  ...INPUT_CONTAINER,
  marginLeft: 4,
};
export default PatientList;
