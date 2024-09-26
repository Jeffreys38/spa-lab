import { AppDispatch, RootState } from '@/src/store';
import { useModalContext } from '../../../src/context/ModalContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function TabLayout() {
    const { isShowModalOpen, setShowModalOpen } = useModalContext();
    const dispatch: AppDispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.auth);

    const handleAdd = () => setShowModalOpen(!isShowModalOpen);

    const menuRight = () => {
        return (
            <View style={{flexDirection: 'row', paddingHorizontal: 30}}>
                <TouchableOpacity >
                    <AntDesign style={{marginRight: 35}} name="search1" size={26} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAdd}>
                    <AntDesign name="plus" size={26} color="white" />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: 'Hi, ' + user.firstName,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    headerRight: (props) => menuRight(),
                    headerStyle: {
                        backgroundColor: '#00ab55',
                    },
                    headerTintColor: 'white'
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                    headerStyle: {
                        backgroundColor: '#00ab55',
                    },
                    headerTintColor: 'white'
                }}
            />
        </Tabs>
    );
}
