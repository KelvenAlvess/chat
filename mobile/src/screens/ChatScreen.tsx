import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { webSocketService } from '../services/websocket';


type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface ChatMessage {
    messageId: number;
    content: string;
    senderId: number;
    recipientId: number;
    timestamp: string;
    isRead?: boolean;
}

export default function ChatScreen() {
    const { user } = useContext(AuthContext);
    const route = useRoute<ChatScreenRouteProp>();

    const { otherUserId, otherUsername } = route.params;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (!user) return;


        api.put(`/api/chat/messages/${otherUserId}/read`).catch(console.error);


        const fetchHistory = async () => {
            try {

                const response = await api.get(`/api/chat/messages/${otherUserId}?page=0&size=50`);

                setMessages(response.data.content);
            } catch (error) {
                console.error("Erro ao buscar histórico:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();


        webSocketService.connect(user.userId, (novaMensagem: ChatMessage) => {

            if (novaMensagem.senderId === otherUserId) {
                setMessages((mensagensAntigas) => [novaMensagem, ...mensagensAntigas]);

                api.put(`/api/chat/messages/${otherUserId}/read`).catch(console.error);
            }
        });

        return () => {
            webSocketService.disconnect();
        };
    }, [user, otherUserId]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !user) return;

        const novaMensagem = {
            senderId: user.userId,
            recipientId: otherUserId,
            content: inputText.trim(),
            type: "CHAT"
        };

        webSocketService.sendMessage(novaMensagem);

        const mensagemLocal: ChatMessage = {
            messageId: Date.now(),
            ...novaMensagem,
            timestamp: new Date().toISOString()
        };

        setMessages((mensagensAntigas) => [mensagemLocal, ...mensagensAntigas]);
        setInputText('');
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isMyMessage = item.senderId === user?.userId;

        const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.theirMessage]}>
                <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.theirMessageText]}>
                    {item.content}
                </Text>
                <Text style={styles.timeText}>{time}</Text>
            </View>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.messageId.toString()}
                renderItem={renderMessage}
                inverted={true}
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite uma mensagem..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E5DDD5' },
    listContent: { padding: 15 },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
    },
    messageText: { fontSize: 16 },
    myMessageText: { color: '#000' },
    theirMessageText: { color: '#000' },
    timeText: { fontSize: 10, color: '#888', alignSelf: 'flex-end', marginTop: 4 },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#FFF',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#E0E0E0'
    },
    input: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        maxHeight: 100,
        fontSize: 16
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#007BFF',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    sendButtonText: { color: '#FFF', fontWeight: 'bold' }
});