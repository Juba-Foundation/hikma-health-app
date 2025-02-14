import {LanguageString} from './LanguageString';

export interface User {
  id: string;
  name: LanguageString;
  role: string;
  email: string;
  instance_url: string;
  phone: string;
}

export interface NewUser {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  instance_url: string;
}
