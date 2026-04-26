import React, { useState } from 'react';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { authColors, authStyles } from '../theme/authStyles';
import api from '../services/api';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
    const navigation = useNavigation<ForgotPasswordNavigationProp>();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        if (!email.trim()) {
            Alert.alert('Atencao', 'Informe seu e-mail.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/auth/forgot-password', { email: email.trim().toLowerCase() });
            navigation.navigate('VerifyCode', { email: email.trim().toLowerCase() });
        } catch (error: any) {
            Alert.alert('Erro', error?.response?.data?.message || 'Nao foi possivel enviar o codigo.');
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
                    <Text style={authStyles.title}>Recuperar senha</Text>
                    <Text style={authStyles.subtitle}>Digite seu e-mail para receber o codigo de recuperacao.</Text>
                </View>

                <View style={authStyles.form}>
                    <TextInput
                        style={authStyles.input}
                        placeholder="E-mail"
                        placeholderTextColor={authColors.placeholder}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TouchableOpacity style={authStyles.primaryButton} onPress={handleSendCode} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={authColors.primaryButtonText} />
                        ) : (
                            <Text style={authStyles.primaryButtonText}>Enviar Codigo</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={authStyles.secondaryButton}
                        onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Login'))}
                    >
                        <Text style={authStyles.secondaryButtonText}>Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={authStyles.secondaryButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={authStyles.secondaryButtonText}>Voltar ao Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
