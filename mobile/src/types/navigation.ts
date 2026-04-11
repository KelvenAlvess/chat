export type RootStackParamList = {
    Login: undefined;

    // Telas Privadas
    Inbox: undefined;
    Chat: { otherUserId: number; otherUsername: string };
};