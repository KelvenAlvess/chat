import {Client, IMessage} from "@stomp/stompjs";
import * as SecureStore from "expo-secure-store";

const WS_URL = 'ws://192.168.0.7:8082/ws'

class WebSocketService {
    private client: Client | null = null;

    async connect(myUserId : number, onMessageReceived: (msg: any) => void) {
        const token = await SecureStore.getItemAsync('jwt_token');

        if (!token) {
            console.error('Nenhum token encontrado. Impossível conectar ao WebSocket.');
            return;
        }

        this.client = new Client({
            brokerURL: WS_URL,
            webSocketFactory: () => new WebSocket(WS_URL),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            reconnectDelay: 5000,

            onConnect: () => {
                console.log('WebSocket conectado com sucesso!');
                this.client?.subscribe(`/user/${myUserId}/queue/messages`, (message: IMessage) => {
                    const newMessage = JSON.parse(message.body);
                    onMessageReceived(newMessage);
                });
            },
            onStompError: (frame) => {
                console.error('ERRO no STOMP:', frame.headers['message']);
            },
            onWebSocketClose: () => {
                console.log('Conexão WebSocket fechada.');
            }
        });
        this.client.activate();
    }

    sendMessage(chatMessage : { chatRoomId: number | null, senderId: number, recipientId: number, content: string, messageType: string }) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: '/app/chat',
                body: JSON.stringify(chatMessage)
            });
        } else {
            console.error('Tentativa de envio com erro. Websocket desconectado.');
        }
    }

        disconnect() {
        if (this.client) {
            this.client.deactivate();
        }
    }
}

export const webSocketService = new WebSocketService();