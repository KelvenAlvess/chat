import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { authColors, authStyles } from '../theme/authStyles';

export default function LoginScreen() {
    const { login } = useContext(AuthContext);

    type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Atencao', 'Preencha usuario e senha!');
            return;
        }

        setLoading(true);
        try {
            await login(username, password);
        } catch (error: any) {
            Alert.alert('Erro de Autenticacao', error.message);
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
                    <Text style={authStyles.title}>Bem-vindo de volta</Text>
                    <Text style={authStyles.subtitle}>Faca login para continuar suas conversas.</Text>
                </View>

                <View style={authStyles.form}>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Digite seu username"
                        placeholderTextColor={authColors.placeholder}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={authStyles.input}
                        placeholder="Digite sua senha"
                        placeholderTextColor={authColors.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotPassword')}
                        style={{ alignSelf: 'flex-end', marginTop: 4 }}
                    >
                        <Text style={{ color: authColors.subtitle, fontSize: 13 }}>Esqueci minha senha</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={authStyles.primaryButton}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={authColors.primaryButtonText} />
                        ) : (
                            <Text style={authStyles.primaryButtonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={authStyles.secondaryButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={authStyles.secondaryButtonText}>Nao tem conta? Criar nova conta</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
