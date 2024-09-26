import { Slot, Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

import { store } from '../src/store';

export default function Root() {
  return (
      <Provider store={store}>
          <GluestackUIProvider config={config}>
              <Stack>
                  <Stack.Screen name="(app)" options={{ headerShown: false }} />
                  <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
                  <Stack.Screen name="signup" options={{ title: '', headerShown: false }} />
                  <Stack.Screen name="forgot" options={{ title: '', headerTintColor: 'black' }} />
              </Stack>
          </GluestackUIProvider>
      </Provider>
  );
}
