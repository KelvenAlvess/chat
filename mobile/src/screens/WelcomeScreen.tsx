import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { authColors } from '../theme/authStyles';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.heroSection}>
                    <Text style={styles.title}>Conecte-se com o mundo</Text>
                    <Text style={styles.subtitle}>
                        Converse em tempo real com quem importa para voce, com simplicidade e privacidade.
                    </Text>
                </View>

                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.primaryButtonText}>Fazer Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.secondaryButtonText}>Criar Nova Conta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: authColors.background,
    },
    container: {
        flex: 1,
        backgroundColor: authColors.background,
        paddingHorizontal: 28,
        paddingVertical: 36,
        justifyContent: 'space-between',
    },
    heroSection: {
        marginTop: 40,
        gap: 14,
    },
    title: {
        color: authColors.title,
        fontSize: 38,
        lineHeight: 44,
        fontWeight: '800',
    },
    subtitle: {
        color: authColors.subtitle,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
    },
    actionsSection: {
        marginBottom: 26,
        gap: 14,
    },
    primaryButton: {
        height: 56,
        borderRadius: 30,
        backgroundColor: authColors.primaryButtonBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: authColors.primaryButtonText,
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        height: 56,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: authColors.secondaryButtonBorder,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    secondaryButtonText: {
        color: authColors.secondaryButtonText,
        fontSize: 16,
        fontWeight: '600',
    },
});
