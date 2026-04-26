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

type ResetPasswordNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen() {
    const navigation = useNavigation<ResetPasswordNavigationProp>();
    const route = useRoute<ResetPasswordRouteProp>();
    const { email, code } = route.params;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Atencao', 'Preencha os dois campos de senha.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Atencao', 'As senhas nao coincidem.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/auth/reset-password', {
                email,
                code,
                newPassword,
            });
            Alert.alert('Sucesso', 'Senha redefinida com sucesso.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') },
            ]);
        } catch (error: any) {
            Alert.alert('Erro', error?.response?.data?.message || 'Nao foi possivel redefinir a senha.');
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
                    <Text style={authStyles.title}>Nova senha</Text>
                    <Text style={authStyles.subtitle}>Defina sua nova senha para o e-mail {email}.</Text>
                </View>

                <View style={authStyles.form}>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Nova senha"
                        placeholderTextColor={authColors.placeholder}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />

                    <TextInput
                        style={authStyles.input}
                        placeholder="Confirmar nova senha"
                        placeholderTextColor={authColors.placeholder}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={authStyles.primaryButton} onPress={handleResetPassword} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={authColors.primaryButtonText} />
                        ) : (
                            <Text style={authStyles.primaryButtonText}>Redefinir Senha</Text>
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
