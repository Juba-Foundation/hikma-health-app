import React from 'react';
// import { createStackNavigator } from '';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createAppContainer} from 'react-navigation';

import Login from '../components/Login';
import PatientList from '../components/PatientList';
import NewPatient from '../components/NewPatient';
import PatientView from '../components/PatientView';
import NewVisit from '../components/NewVisit';
import Covid19Form from '../components/Covid19Form';
import EditPatient from '../components/EditPatient';
import OpenTextEvent from '../components/OpenTextEvent';
import EditOpenTextEvent from '../components/EditOpenTextEvent';
import Vitals from '../components/Vitals';
import VisitList from '../components/VisitList';
import EventList from '../components/EventList';
import EditVitals from '../components/EditVitals';
import MedicalHistory from '../components/MedicalHistory';
import Examination from '../components/Examination';
import Physiotherapy from '../components/Physiotherapy';
import Medicine from '../components/Medicine';
import EditExamination from '../components/EditExamination';
import EditMedicalHistory from '../components/EditMedicalHistory';
import EditPhysiotherapy from '../components/EditPhysiotherapy';
import EditMedicine from '../components/EditMedicine';
import SnapshotList from '../components/SnapshotList';
import {Patient} from '../types/Patient';
import {Event} from '../types/Event';
import {Visit} from '../types/Visit';

export type RootStackParamList = {
  Login: undefined;
  PatientList: {
    clinicId: string;
    email: string;
    password: string;
    instanceUrl: string;
    userId: string;
    reloadPatientsToggle: boolean;
  };
  NewPatient: {
    reloadPatientsToggle: boolean;
  };
  PatientView: {
    clinicId: string;
    userId: string;
    patient: Patient;
    reloadPatientsToggle: boolean;
  };
  EditPatient: {
    patient: Patient;
  };
  NewVisit: {
    patient: Patient;
    visitId: string;
    userName: string;
    existingVisit: boolean;
  };
  Covid19Form: {
    patient: Patient;
    visitId: string;
  };
  OpenTextEvent: {
    eventType: string;
    patientId: string;
    visitId: string;
  };
  EditOpenTextEvent: {
    event: Event;
  };
  Vitals: {
    patientId: string;
    visitId: string;
  };
  VisitList: {
    patient: Patient;
    userName: string;
  };
  Examination: {
    patientId: string;
    visitId: string;
    userName: string;
  };
  EditVitals: {
    event: Event;
  };
  EventList: {
    userName: string;
    patient: Patient;
    visit: Visit;
    events: Event[];
  };
  MedicalHistory: {
    patientId: string;
    visitId: string;
    userName: string;
  };
  Physiotherapy: {
    patientId: string;
    visitId: string;
    userName: string;
  };
  Medicine: {
    patientId: string;
    visitId: string;
    userName: string;
  };
  EditExamination: {
    event: Event;
    userName: string;
  };
  EditMedicalHistory: {
    event: Event;
    userName: string;
  };
  EditPhysiotherapy: undefined;
  EditMedicine: {
    event: Event;
    userName: string;
  };
  SnapshotList: {
    patient: Patient;
    eventType: any;
    events: Event[];
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="PatientList" component={PatientList} />
      <Stack.Screen name="NewPatient" component={NewPatient} />
      <Stack.Screen name="PatientView" component={PatientView} />
      <Stack.Screen name="EditPatient" component={EditPatient} />
      <Stack.Screen name="NewVisit" component={NewVisit} />
      <Stack.Screen name="Covid19Form" component={Covid19Form} />
      <Stack.Screen name="OpenTextEvent" component={OpenTextEvent} />
      <Stack.Screen name="EditOpenTextEvent" component={EditOpenTextEvent} />
      <Stack.Screen name="Vitals" component={Vitals} />
      <Stack.Screen name="EditVitals" component={EditVitals} />
      <Stack.Screen name="VisitList" component={VisitList} />
      <Stack.Screen name="EventList" component={EventList} />
      <Stack.Screen name="MedicalHistory" component={MedicalHistory} />
      <Stack.Screen name="Examination" component={Examination} />
      <Stack.Screen name="Physiotherapy" component={Physiotherapy} />
      <Stack.Screen name="Medicine" component={Medicine} />
      <Stack.Screen name="EditExamination" component={EditExamination} />
      <Stack.Screen name="EditMedicalHistory" component={EditMedicalHistory} />
      <Stack.Screen name="EditPhysiotherapy" component={EditPhysiotherapy} />
      <Stack.Screen name="EditMedicine" component={EditMedicine} />
      <Stack.Screen name="SnapshotList" component={SnapshotList} />
    </Stack.Navigator>
  );
}

// const rootNavigator = createStackNavigator(
//   {
//     Home: {
//       screen: Login,
//       navigationOptions: () => ({
//         title: `Login`,
//         header: null,
//       })
//     },
//     PatientList: {
//       screen: PatientList,
//       navigationOptions: () => ({
//         title: `PatientList`,
//         header: null,
//       })
//     },
//     NewPatient: {
//       screen: NewPatient,
//       navigationOptions: () => ({
//         title: `NewPatient`,
//         header: null,
//       })
//     },
//     PatientView: {
//       screen: PatientView,
//       navigationOptions: () => ({
//         title: `PatientView`,
//         header: null,
//       })
//     },
//     EditPatient: {
//       screen: EditPatient,
//       navigationOptions: () => ({
//         title: `EditPatient`,
//         header: null,
//       })
//     },
//     NewVisit: {
//       screen: NewVisit,
//       navigationOptions: () => ({
//         title: `NewVisit`,
//         header: null,
//       })
//     },
//     Covid19Form: {
//       screen: Covid19Form,
//       navigationOptions: () => ({
//         title: `Covid19Form`,
//         header: null
//       })
//     },
//     OpenTextEvent: {
//       screen: OpenTextEvent,
//       navigationOptions: () => ({
//         title: `OpenTextEvent`,
//         header: null
//       })
//     },
//     EditOpenTextEvent: {
//       screen: EditOpenTextEvent,
//       navigationOptions: () => ({
//         title: `EditOpenTextEvent`,
//         header: null
//       })
//     },
//     Vitals: {
//       screen: Vitals,
//       navigationOptions: () => ({
//         title: `Vitals`,
//         header: null
//       })
//     },
//     EditVitals: {
//       screen: EditVitals,
//       navigationOptions: () => ({
//         title: `EditVitals`,
//         header: null
//       })
//     },
//     MedicalHistory: {
//       screen: MedicalHistory,
//       navigationOptions: () => ({
//         title: `MedicalHistory`,
//         header: null
//       })
//     },
//     EditMedicalHistory: {
//       screen: EditMedicalHistory,
//       navigationOptions: () => ({
//         title: `EditMedicalHistory`,
//         header: null
//       })
//     },
//     Examination: {
//       screen: Examination,
//       navigationOptions: () => ({
//         title: `Examination`,
//         header: null
//       })
//     },
//     EditExamination: {
//       screen: EditExamination,
//       navigationOptions: () => ({
//         title: `EditExamination`,
//         header: null
//       })
//     },
//     Physiotherapy: {
//       screen: Physiotherapy,
//       navigationOptions: () => ({
//         title: `Physiotherapy`,
//         header: null
//       })
//     },
//     EditPhysiotherapy: {
//       screen: EditPhysiotherapy,
//       navigationOptions: () => ({
//         title: `EditPhysiotherapy`,
//         header: null
//       })
//     },
//     Medicine: {
//       screen: Medicine,
//       navigationOptions: () => ({
//         title: `Medicine`,
//         header: null
//       })
//     },
//     EditMedicine: {
//       screen: EditMedicine,
//       navigationOptions: () => ({
//         title: `EditMedicine`,
//         header: null
//       })
//     },
//     VisitList: {
//       screen: VisitList,
//       navigationOptions: () => ({
//         title: `VisitList`,
//         header: null
//       })
//     },
//     EventList: {
//       screen: EventList,
//       navigationOptions: () => ({
//         title: `EventList`,
//         header: null
//       })
//     },
//     SnapshotList: {
//       screen: SnapshotList,
//       navigationOptions: () => ({
//         title: `SnapshotList`,
//         header: null
//       })
//     }
//   },
//   {
//     initialRouteName: 'Home'
//   });

// export default createAppContainer(rootNavigator);
