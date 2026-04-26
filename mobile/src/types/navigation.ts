export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    VerifyCode: { email: string };
    ResetPassword: { email: string; code: string };

    Inbox: undefined;
    Contacts: undefined;
    Chat: { otherUserId: number; otherUsername: string };
};