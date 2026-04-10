import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando os Tipos
import { RootStackParamList } from './src/types/navigation';

// Importando as Telas
import LoginScreen from './src/screens/LoginScreen';
import RoomListScreen from './src/screens/RoomListScreen';

// Injetando a tipagem no Stack
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">

                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="RoomList"
                    component={RoomListScreen}
                    options={{ title: 'Conversas' }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}