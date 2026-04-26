import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';
import { authColors, authStyles } from '../theme/authStyles';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
    const navigation = useNavigation<RegisterScreenNavigationProp>();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [cellphoneNumber, setCellphoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !password || !email || !cellphoneNumber) {
            Alert.alert('Atencao', 'Preencha todos os campos!');
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/users/register', {
                username,
                email: email.trim().toLowerCase(),
                cellphoneNumber,
                password,
            });

            Alert.alert('Sucesso!', 'Conta criada. Faca o login.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') },
            ]);
        } catch (error: any) {
            console.error('Erro no cadastro:', error);
            Alert.alert('Erro', 'Nao foi possivel criar a conta. Verifique os dados ou tente outro username.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={authStyles.safeArea}>
            <KeyboardAvoidingView
                style={authStyles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={authStyles.header}>
                    <Text style={authStyles.title}>Crie sua conta</Text>
                    <Text style={authStyles.subtitle}>Comece agora e entre nas suas conversas em segundos.</Text>
                </View>

                <View style={authStyles.form}>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Nome de usuario"
                        placeholderTextColor={authColors.placeholder}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={authStyles.input}
                        placeholder="E-mail"
                        placeholderTextColor={authColors.placeholder}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={authStyles.input}
                        placeholder="Celular (ex: 81999999999)"
                        placeholderTextColor={authColors.placeholder}
                        value={cellphoneNumber}
                        onChangeText={setCellphoneNumber}
                        keyboardType="phone-pad"
                    />

                    <TextInput
                        style={authStyles.input}
                        placeholder="Senha"
                        placeholderTextColor={authColors.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={authStyles.primaryButton}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={authColors.primaryButtonText} />
                        ) : (
                            <Text style={authStyles.primaryButtonText}>Cadastrar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={authStyles.secondaryButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={authStyles.secondaryButtonText}>Ja tem conta? Fazer login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
