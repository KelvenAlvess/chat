import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

interface ChatInbox {
    chatId: string;
    otherUserId: number;
    otherUsername: string;
    lastMessageContent: string;
    lastMessageTimestamp: string;
    unreadCount: number;
}

type InboxScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Inbox'>;

export default function InboxScreen() {
    const { user } = useContext(AuthContext);
    const navigation = useNavigation<InboxScreenNavigationProp>();

    const [inbox, setInbox] = useState<ChatInbox[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchInbox = async () => {
        try {
            const response = await api.get<ChatInbox[]>('/api/chat/inbox');
            setInbox(response.data);
        } catch (error) {
            console.error("Erro ao buscar inbox:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchInbox();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchInbox();
    };

    const renderItem = ({ item }: { item: ChatInbox }) => {

        const timestampUTC = item.lastMessageTimestamp.endsWith('Z') ? item.lastMessageTimestamp : `${item.lastMessageTimestamp}Z`;
        const date = new Date(timestampUTC);
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        return (
            <TouchableOpacity
                style={styles.chatCard}
                onPress={() => navigation.navigate('Chat', {
                    otherUserId: item.otherUserId,
                    otherUsername: item.otherUsername
                })}
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.otherUsername.charAt(0).toUpperCase()}</Text>
                </View>

                <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                        <Text style={styles.username}>{item.otherUsername}</Text>
                        <Text style={styles.time}>{formattedTime}</Text>
                    </View>

                    <View style={styles.chatFooter}>
                        <Text
                            style={[styles.lastMessage, item.unreadCount > 0 && styles.unreadMessageText]}
                            numberOfLines={1}
                        >
                            {item.lastMessageContent || "Nenhuma mensagem ainda"}
                        </Text>

                        {item.unreadCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {inbox.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Você ainda não tem conversas.</Text>
                    <Text style={styles.emptySubText}>Que tal iniciar um novo chat?</Text>
                </View>
            ) : (
                <FlatList
                    data={inbox}
                    keyExtractor={(item) => item.chatId}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Contacts')}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555' },
    emptySubText: { fontSize: 14, color: '#888', marginTop: 10 },
    chatCard: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#007BFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    chatInfo: { flex: 1, justifyContent: 'center' },
    chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    username: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    time: { fontSize: 12, color: '#888' },
    chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lastMessage: { fontSize: 14, color: '#666', flex: 1, paddingRight: 10 },
    unreadMessageText: { fontWeight: 'bold', color: '#000' },
    badge: { backgroundColor: '#25D366', borderRadius: 12, minWidth: 24, height: 24, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

    // Estilos do Botão Flutuante
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#007BFF',
        borderRadius: 30,
        elevation: 5, // Sombra no Android
        shadowColor: '#000', // Sombra no iOS
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    fabIcon: {
        fontSize: 30,
        color: 'white',
        lineHeight: 32,
    }
});