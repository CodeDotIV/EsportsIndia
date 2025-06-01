import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './screens/bottonscreens/BottomTabNavigator.js';
import Freefire from './screens/esports/freefire.js';
import Bgmi from './screens/esports/bgmi.js';
import Callofduty from './screens/esports/callofduty.js';
import Erangel from './screens/esports/bgmi/erangel/erangel.js';
import EntryScreen from './screens/entryscreen';
import LoginScreen from './screens/login/LoginScreen';
import SignupScreen from './screens/login/SignupScreen';
import OTPScreen from './screens/login/otpscreen';
import Livik from './screens/esports/bgmi/livik/livik.js';
import ResetPasswordScreen from './screens/login/resetpasswordscreen';
import Nusa from './screens/esports/bgmi/nusa/nusa.js';
import Register from './screens/register';
import Liviksolo from './screens/esports/bgmi/livik/solo/liviksolo.js';
import Livikduo from './screens/esports/bgmi/livik/duo/livikduo.js';
import Liviksquad from './screens/esports/bgmi/livik/squad/liviksquad.js';
import Erangelsolo from './screens/esports/bgmi/erangel/solo/erangelsolo.js';
import Erangelduo from './screens/esports/bgmi/erangel/duo/erangelduo.js';
import Erangelsquad from './screens/esports/bgmi/erangel/squad/erangelsquad.js';
import Nusasolo from './screens/esports/bgmi/nusa/solo/nusasolo.js';
import Nusaduo from './screens/esports/bgmi/nusa/duo/nusaduo.js';
import Nusasquad from './screens/esports/bgmi/nusa/squad/nusasquad.js';
import Shanoksolo from './screens/esports/bgmi/shanok/solo/shanoksolo.js';
import Shanokduo from './screens/esports/bgmi/shanok/duo/shanokduo.js';
import Shanoksquad from './screens/esports/bgmi/shanok/squad/shanoksquad.js';
import Shanok from './screens/esports/bgmi/shanok/shanok.js';
import Liviksoloregister from './screens/esports/bgmi/livik/solo/liviksoloregister.js';
import Livikduoregister from './screens/esports/bgmi/livik/duo/livikduoregister.js';
import Liviksquadregister from './screens/esports/bgmi/livik/squad/liviksquadregister.js';
import Erangelsoloregister from './screens/esports/bgmi/erangel/solo/erangelsoloregister.js'
import Erangelduoregister from './screens/esports/bgmi/erangel/duo/erangelduoregister.js';
import Erangelsquadregister from './screens/esports/bgmi/erangel/squad/erangelsquadregister.js';
import Nusasoloregister from './screens/esports/bgmi/nusa/solo/nusasoloregister.js'
import Nusaduoregister from './screens/esports/bgmi/nusa/duo/nusaduoregister.js';
import Nusasquadregister from './screens/esports/bgmi/nusa/squad/nusasquadregister.js';
import Shanoksoloregister from './screens/esports/bgmi/shanok/solo/shanoksoloregister.js';
import Shanokduoregister from './screens/esports/bgmi/shanok/duo/shanokduoregister.js';
import Shanoksquadregister from './screens/esports/bgmi/shanok/squad/shanoksquadregister.js'
import Aboutbgmi from './screens/aboutbgmi.js';
import Aboutfreefire from './screens/aboutfreefire.js';
import Aboutcallofduty from './screens/aboutcallofduty.js';
import Esportsarena from './screens/esportsarena.js';
import { auth } from './screens/login/AuthService';
console.log('Firebase Auth:', auth);
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Entryscreen" component={EntryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Livik" component={Livik} options={{ headerShown: false }} />
        <Stack.Screen name="Aboutbgmi" component={Aboutbgmi} options={{ headerShown: false }}/>
        <Stack.Screen name="Aboutfreefire" component={Aboutfreefire} options={{ headerShown: false }}/>
        <Stack.Screen name="Aboutcallofduty" component={Aboutcallofduty} options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Otpscreen" component={OTPScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Resetpasswordscreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Bgmi" component={Bgmi} options={{ headerShown: false }} />
        <Stack.Screen name="Freefire" component={Freefire} options={{ headerShown: false }} />
        <Stack.Screen name="Callofduty" component={Callofduty} options={{ headerShown: false }} />
        <Stack.Screen name="Erangel" component={Erangel} options={{ headerShown: false }} />
        <Stack.Screen name="Shanok" component={Shanok} options={{ headerShown: false }} />
        <Stack.Screen name="Nusa" component={Nusa} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Liviksolo" component={Liviksolo} options={{ headerShown: false }} />
        <Stack.Screen name="Livikduo" component={Livikduo} options={{ headerShown: false }} />
        <Stack.Screen name="Liviksquad" component={Liviksquad} options={{ headerShown: false }} />
        <Stack.Screen name="Erangelsolo" component={Erangelsolo} options={{ headerShown: false }} />
        <Stack.Screen name="Erangelduo" component={Erangelduo} options={{ headerShown: false }} />
        <Stack.Screen name="Erangelsquad" component={Erangelsquad} options={{ headerShown: false }} />
        <Stack.Screen name="Nusasolo" component={Nusasolo} options={{ headerShown: false }} />
        <Stack.Screen name="Nusaduo" component={Nusaduo} options={{ headerShown: false }} />
        <Stack.Screen name="Nusasquad" component={Nusasquad} options={{ headerShown: false }} />
        <Stack.Screen name="Shanoksolo" component={Shanoksolo} options={{ headerShown: false }} />
        <Stack.Screen name="Shanokduo" component={Shanokduo} options={{ headerShown: false }} />
        <Stack.Screen name="Shanoksquad" component={Shanoksquad} options={{ headerShown: false }} />
        <Stack.Screen name="Liviksoloregister" component={Liviksoloregister} options={{ headerShown: false }} />
        <Stack.Screen name="Livikduoregister" component={Livikduoregister} options={{ headerShown: false }} />
        <Stack.Screen name="Liviksquadregister" component={Liviksquadregister} options={{ headerShown: false }} />
        <Stack.Screen name="Erangelsoloregister" component={Erangelsoloregister} options={{ headerShown: false }} />
        <Stack.Screen name="Erangelduoregister" component={Erangelduoregister} options={{ headerShown: false }} />
        <Stack.Screen name="Erangelsquadregister" component={Erangelsquadregister} options={{ headerShown: false }} />
        <Stack.Screen name="Nusasoloregister" component={Nusasoloregister} options={{ headerShown: false }} />
        <Stack.Screen name="Nusaduoregister" component={Nusaduoregister} options={{ headerShown: false }} />
        <Stack.Screen name="Nusasquadregister" component={Nusasquadregister} options={{ headerShown: false }} />
        <Stack.Screen name="Shanoksoloregister" component={Shanoksoloregister} options={{ headerShown: false }} />
        <Stack.Screen name="Shanokduoregister" component={Shanokduoregister} options={{ headerShown: false }} />
        <Stack.Screen name="Shanoksquadregister" component={Shanoksquadregister} options={{ headerShown: false }} />
        <Stack.Screen name="Esportsarena" component={Esportsarena} options={{headerShown: false}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
