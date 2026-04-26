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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { authColors, authStyles } from '../theme/authStyles';
import api from '../services/api';

type VerifyCodeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyCode'>;
type VerifyCodeRouteProp = RouteProp<RootStackParamList, 'VerifyCode'>;

export default function VerifyCodeScreen() {
    const navigation = useNavigation<VerifyCodeNavigationProp>();
    const route = useRoute<VerifyCodeRouteProp>();
    const { email } = route.params;

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerifyCode = async () => {
        if (!code.trim()) {
            Alert.alert('Atencao', 'Informe o codigo recebido.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/auth/verify-code', { email, code: code.trim() });
            navigation.navigate('ResetPassword', { email, code: code.trim() });
        } catch (error: any) {
            Alert.alert('Erro', error?.response?.data?.message || 'Codigo invalido ou expirado.');
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
                    <Text style={authStyles.title}>Verifique o codigo</Text>
                    <Text style={authStyles.subtitle}>Enviamos um codigo para {email}. Confira sua caixa de entrada.</Text>
                </View>

                <View style={authStyles.form}>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Codigo"
                        placeholderTextColor={authColors.placeholder}
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                    />

                    <TouchableOpacity style={authStyles.primaryButton} onPress={handleVerifyCode} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={authColors.primaryButtonText} />
                        ) : (
                            <Text style={authStyles.primaryButtonText}>Verificar Codigo</Text>
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
