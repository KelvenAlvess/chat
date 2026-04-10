import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RoomListScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Salas Disponíveis</Text>
            <Text>Em breve a lista de salas aparecerá aqui!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});