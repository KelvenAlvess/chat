import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Tipagem específica para a propriedade de navegação desta tela
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo ao Chat</Text>

            {/* Se você tentar digitar um nome de tela que não existe em RootStackParamList,
          o VS Code vai sublinhar de vermelho acusando erro! */}
            <Button
                title="Entrar"
                onPress={() => navigation.navigate('RoomList')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    }
});