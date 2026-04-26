import { StyleSheet } from 'react-native';

export const authColors = {
    background: '#0B132B',
    title: '#FFFFFF',
    subtitle: '#8892B0',
    placeholder: '#9AA8C7',
    inputBackground: 'rgba(255,255,255,0.10)',
    inputBorder: 'rgba(255,255,255,0.18)',
    primaryButtonBackground: '#FFFFFF',
    primaryButtonText: '#0B132B',
    secondaryButtonBorder: '#CCD6F6',
    secondaryButtonText: '#CCD6F6',
};

export const authStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: authColors.background,
    },
    container: {
        flex: 1,
        backgroundColor: authColors.background,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        marginBottom: 24,
        gap: 8,
    },
    title: {
        color: authColors.title,
        fontSize: 32,
        fontWeight: '800',
    },
    subtitle: {
        color: authColors.subtitle,
        fontSize: 15,
    },
    form: {
        gap: 12,
    },
    input: {
        height: 54,
        borderRadius: 16,
        backgroundColor: authColors.inputBackground,
        borderWidth: 1,
        borderColor: authColors.inputBorder,
        color: authColors.title,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    primaryButton: {
        marginTop: 8,
        height: 56,
        borderRadius: 30,
        backgroundColor: authColors.primaryButtonBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: authColors.primaryButtonText,
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        marginTop: 8,
        height: 56,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: authColors.secondaryButtonBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: authColors.secondaryButtonText,
        fontSize: 15,
        fontWeight: '600',
    },
});

