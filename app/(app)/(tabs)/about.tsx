import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMessageContext } from '@/src/context/MessageContext';

const AboutUs = () => {
    const { t } = useTranslation();
    const { setShowMessageOpen, setMessage, isError } = useMessageContext();

    const handlePhoneCall = async () => {
        try {
            await Linking.openURL('tel:+987654321');
        } catch (error) {
            setMessage('Failed to open phone dialer', true);
            setShowMessageOpen(true);
            console.debug('Failed to open phone dialer:', error);
        }
    };

    const handleZaloLink = async () => {
        try {
            await Linking.openURL('zalo://123456789');
        } catch (error) {
            setMessage('Failed to open Zalo', true);
            setShowMessageOpen(true);
            console.debug('Failed to open Zalo:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{t('aboutUs.title')}</Text>
            <Text style={styles.subtitle}>{t('aboutUs.team.subtitle')}</Text>
            <Text style={styles.text}>
                {t('aboutUs.team.description')}
            </Text>
            <View style={{borderWidth: 2, padding: 10, margin: 10}}>
                <View style={{flexDirection: 'row'}}>
                    <Image
                        style={{resizeMode: 'stretch', width: '50%', height: 300}}
                        source={require('@/assets/images/1.png')}
                    />
                    <Image
                        style={{resizeMode: 'stretch', width: '50%', height: 300}}
                        source={require('@/assets/images/2.png')}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Image
                        style={{resizeMode: 'stretch', width: '50%', height: 300}}
                        source={require('@/assets/images/3.png')}
                    />
                    <Image
                        style={{resizeMode: 'stretch', width: '50%', height: 300}}
                        source={require('@/assets/images/4.png')}
                    />
                </View>
            </View>

            <Text style={styles.subtitle}>{t('aboutUs.mission.subtitle')}</Text>
            <Text style={styles.text}>
                {t('aboutUs.mission.description')}
            </Text>

            <Text style={styles.subtitle}>{t('aboutUs.coreValues.subtitle')}</Text>
            <Text style={styles.text}>
                {t('aboutUs.coreValues.description')}
            </Text>

            <Text style={styles.subtitle}>{t('aboutUs.contact.subtitle')}</Text>
            <Text style={styles.text}>
                {t('aboutUs.contact.description')}
            </Text>

            {/* New Contact Section */}
            <TouchableOpacity style={{backgroundColor: 'black', padding: 10}} onPress={handleZaloLink}>
                <Text style={[styles.subtitle, { color: 'white'}]}>{t('aboutUs.contact.zaloSubtitle')}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>
                {t('aboutUs.contact.zaloDescription')}
            </Text>
            <TouchableOpacity style={{backgroundColor: 'black', padding: 10}} onPress={handlePhoneCall}>
                <Text style={[styles.subtitle, { color: 'white'}]}>{t('aboutUs.contact.phoneSubtitle')}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>
                {t('aboutUs.contact.phoneDescription')}
            </Text>

            <Image
                style={{resizeMode: 'stretch', width: '100%'}}
                source={require('@/assets/images/5.png')}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 15,
        lineHeight: 24,
        textAlign: 'justify',
    },
});

export default AboutUs;
