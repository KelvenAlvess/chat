import React, { useContext } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native'; // <-- Adicione TouchableOpacity e Text
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';

import LoginScreen from '../screens/LoginScreen';
import InboxScreen from '../screens/InboxScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const PlaceholderScreen = () => <View style={{ flex: 1, backgroundColor: 'white' }} />;

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
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
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