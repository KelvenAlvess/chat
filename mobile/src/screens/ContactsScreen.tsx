import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';

interface Contact {
    userId: number;
    username: string;
}

type ContactsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Contacts'>;

export default function ContactsScreen() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<ContactsScreenNavigationProp>();

    useEffect(() => {

        api.get<Contact[]>('/api/users/contacts')
            .then(response => {
                setContacts(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar contatos:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const renderItem = ({ item }: { item: Contact }) => (
        <TouchableOpacity
            style={styles.contactCard}
            // Quando clica no contato, navega para o Chat passando os dados dele!
            onPress={() => navigation.navigate('Chat', {
                otherUserId: item.userId,
                otherUsername: item.username
            })}
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.username}>{item.username}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {contacts.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>Nenhum outro usuário encontrado.</Text>
                </View>
            ) : (
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.userId.toString()}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#888' },
    contactCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#25D366', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    username: { fontSize: 18, fontWeight: '500', color: '#333' }
});