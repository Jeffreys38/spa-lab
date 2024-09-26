import {AppDispatch, RootState} from '@/src/store';
import {useModalContext} from '../../../src/context/ModalContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Tabs} from 'expo-router';
import {TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {I18nextProvider, useTranslation} from 'react-i18next';
import i18n from '@/src/i18n';

export default function TabLayout() {
    const {isShowModalOpen, setShowModalOpen} = useModalContext();
    const dispatch: AppDispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.auth);
    const { t } = useTranslation();

    const handleAdd = () => setShowModalOpen(!isShowModalOpen);

    const menuRight = () => {
        return (
            <View style={{flexDirection: 'row', paddingHorizontal: 30}}>
                {/*<TouchableOpacity >*/}
                {/*    <AntDesign style={{marginRight: 35}} name="search1" size={26} color="white" />*/}
                {/*</TouchableOpacity>*/}
                <TouchableOpacity onPress={handleAdd}>
                    <AntDesign name="plus" size={26} color="white"/>
                </TouchableOpacity>
            </View>
        )
    }

    const menuCustomer = () => {
        return (
            <View style={{flexDirection: 'row', paddingHorizontal: 30}}>
                <TouchableOpacity onPress={handleAdd}>
                    <AntDesign name="plus" size={26} color="white"/>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <I18nextProvider i18n={i18n}>
            <Tabs screenOptions={{tabBarActiveTintColor: '#00ab55'}}>
                <Tabs.Screen
                    name="index"
                    options={{
                        headerTitle: 'Hi, ' + user.firstName,
                        tabBarLabel:  t('dashboard.dashboardHeaderTitle'),
                        tabBarIcon: ({color}) => <FontAwesome size={28} name="home" color={color}/>,
                        headerRight: (props) => menuRight(),
                        headerStyle: {
                            backgroundColor: '#00ab55',
                        },
                        headerTintColor: 'white'
                    }}
                />
                <Tabs.Screen
                    name="customer"
                    options={{
                        title: t('customer.customerHeaderTitle'),
                        tabBarIcon: ({color}) => <AntDesign name="addusergroup" size={24} color={color}/>,
                        headerStyle: {
                            backgroundColor: '#00ab55',
                        },
                        headerTintColor: 'white',
                        headerRight: (props) => menuCustomer(),
                    }}
                />
                <Tabs.Screen
                    name="about"
                    options={{
                        title: t('aboutUs.aboutUsHeaderTitle'),
                        tabBarIcon: ({color}) => <AntDesign name="infocirlceo" size={24} color={color}/>,
                        headerStyle: {
                            backgroundColor: '#00ab55',
                        },
                        headerTintColor: 'white'
                    }}
                />
                <Tabs.Screen
                    name="setting"
                    options={{
                        title: t('settings.settingHeaderTitle'),
                        tabBarIcon: ({color}) => <FontAwesome size={28} name="cog" color={color}/>,
                        headerStyle: {
                            backgroundColor: '#00ab55',
                        },
                        headerTintColor: 'white'
                    }}
                />
            </Tabs>
        </I18nextProvider>
    );
}
