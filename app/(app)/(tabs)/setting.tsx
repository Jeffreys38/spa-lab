import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Avatar, Button, Switch, Divider, List } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../src/store";
import { logout } from '../../../src/store/slices/authSlice';
import { useTranslation } from 'react-i18next'; // Nhập useTranslation
import i18n from '@/src/i18n';

export default function SettingsScreen() {
    const { t } = useTranslation(); // Sử dụng hook để lấy hàm dịch
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [language, setLanguage] = useState('en');
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch: AppDispatch = useDispatch();

    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'vi' : 'en';
        setLanguage(newLanguage);
        i18n.changeLanguage(newLanguage); // Thay đổi ngôn ngữ
    };

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: isDarkMode ? 'black' : '#FFFFFF' }}>
            {/* User Profile Section */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Avatar.Image size={80} source={{ uri: user.photo ? user.photo : 'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg' }} />
                {(user.firstName && user.lastName) ? <Text style={{ fontSize: 18, marginTop: 8, color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                    {`${user.lastName} ${user.firstName}`}
                </Text> : null}
                <Text style={{ fontSize: 14, color: '#888888' }}>{user.email}</Text>
                <Button
                    mode="contained"
                    style={{ marginTop: 16, backgroundColor: isDarkMode ? 'white' : null }}
                    labelStyle={{ color: isDarkMode ? 'black' : 'white' }}
                >
                    {t('settings.editProfile')}
                </Button>
            </View>

            <Divider />

            {/* Notification Settings */}
            <List.Item
                titleStyle={{ color: isDarkMode ? 'white' : null }}
                title={t('settings.enableNotifications')}
                right={() => (
                    <Switch value={notificationsEnabled} onValueChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                )}
            />
            <Divider />

            {/* Theme Settings */}
            <List.Item
                titleStyle={{ color: isDarkMode ? 'white' : null }}
                title={t('settings.darkMode')}
                right={() => <Switch value={isDarkMode} onValueChange={() => setIsDarkMode(!isDarkMode)} />}
            />
            <Divider />

            {/* Language Settings */}
            <List.Item
                titleStyle={{ color: isDarkMode ? 'white' : null }}
                title="Change language to Vietnam"
                right={() => (
                    <Switch value={language === 'vi'} onValueChange={toggleLanguage} />
                )}
            />
            <Divider />

            <Button
                mode="outlined"
                style={{ marginTop: 24, backgroundColor: isDarkMode ? 'white' : null }}
                onPress={() => { dispatch(logout()) }}
                color="red"
            >
                {t('settings.logout')}
            </Button>
        </View>
    );
}
