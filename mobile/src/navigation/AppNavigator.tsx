import React, { useContext } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import InboxScreen from '../screens/InboxScreen';
import ChatScreen from '../screens/ChatScreen';
import ContactsScreen from '../screens/ContactsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { user, isLoading, logout } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user == null ? (
                    <>
                        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Inbox"
                            component={InboxScreen}
                            options={{
                                title: 'Minhas Conversas',
                                headerRight: () => (
                                    <TouchableOpacity onPress={logout} style={{ padding: 10 }}>
                                        <Text style={{ color: '#ff3b30', fontWeight: 'bold' }}>Sair</Text>
                                    </TouchableOpacity>
                                ),
                            }}
                        />

                        <Stack.Screen
                            name="Contacts"
                            component={ContactsScreen}
                            options={{ title: 'Novo Chat' }}
                        />

                        <Stack.Screen
                            name="Chat"
                            component={ChatScreen}
                            options={({ route }) => ({ title: route.params.otherUsername })}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}