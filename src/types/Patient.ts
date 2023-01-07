import {LanguageString} from './LanguageString';

export interface Patient {
  id: string;
  given_name: LanguageString;
  surname: LanguageString;
  date_of_birth: string;
  country: LanguageString;
  hometown: LanguageString;
  section: LanguageString;
  registered_by_provider_id: string;
  serial_number: string;
  sex: string;
  phone: string;
  camp: string;
}

export interface NewPatient {
  id: string;
  given_name: string;
  surname: string;
  date_of_birth: string;
  country: string;
  hometown: string;
  sex: string;
  section: string;
  registered_by_provider_id: string;
  serial_number: string;
  phone: string;
}
