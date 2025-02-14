import React, {useEffect, useState, Fragment} from 'react';
import {AppState} from 'react-native';
import {database} from './src/storage/Database';
import RootNavigation from './src/navigation/RootNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';

// Handle the app going from foreground to background, and vice versa.

const App = () => {
  const [appState, setAppState] = useState(AppState.currentState.toString());

  useEffect(() => {
    appIsNowRunningInForeground();
    setAppState('active');
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: string) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has moved from the background (or inactive) into the foreground
      appIsNowRunningInForeground();
    } else if (
      appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      // App has moved from the foreground into the background (or become inactive)
      appHasGoneToTheBackground();
    }
    setAppState(nextAppState);
  };

  // Code to run when app is brought to the foreground
  const appIsNowRunningInForeground = () => {
    console.log('App is now running in the foreground!');
    return database.open();
  };

  // Code to run when app is sent to the background
  const appHasGoneToTheBackground = () => {
    console.log('App has gone to the background.');
    database.close();
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
