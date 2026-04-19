export type RootStackParamList = {
    Login: undefined;
    
    Inbox: undefined;
    Contacts: undefined; // <-- Nova tela adicionada aqui
    Chat: { otherUserId: number; otherUsername: string };
};