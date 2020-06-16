
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import QR from './Screens/QRcode'
import Register from './Screens/Register';
import Login from './Screens/login';
import MapHospitals from './Screens/MapHospitals';


console.disableYellowBox = true;

const RootStack = createStackNavigator(
  {
  Register: Register,
  QR: QR,
  Login:Login,
  Hospitals:MapHospitals,
  },
  {
    initialRouteName: 'Login',  //Colocar 'Hospitals' y dar ctrl + spor si se puede ingresar al mapa despúes 
                                //de logearse con el usuario 1111 y pass 1111 o el usuario creado
    headerMode:'none'
  },
  
);

export default createAppContainer(RootStack);