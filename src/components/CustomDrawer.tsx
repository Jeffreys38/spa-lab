import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import {
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";
import {useDispatch, useSelector} from "react-redux";

import {AppDispatch, RootState} from "../store";
import {logout} from "../store/slices/authSlice";

const CustomDrawer = (props: any) => {
    const maxEmail = 25;
    const dispatch: AppDispatch = useDispatch();
    const { loading, error, user } = useSelector((state: RootState) => state.auth);

    const filterEmail = () => {
        if (user) {
            let indexDomain =  user.email.indexOf("@");
            let removeDomain = user.email.slice(0, indexDomain);
            let removedString = user.email.slice(indexDomain, user.email.length);

            return removeDomain.length > maxEmail ? removeDomain.slice(0, maxEmail) + removedString : removeDomain + removedString
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{
                    backgroundColor: "black",
                    marginTop: 0,
                    zIndex: 10,
                }}
            >
                <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            <View style={styles.wrapInfo}>
                <Text style={[styles.wrapUserName, {fontWeight: 'regular'}]}>Hi, </Text>
                <Text style={styles.wrapUserName}>{filterEmail()}</Text>
            </View>

            <View style={styles.wrapInfo}>
                <Text style={[styles.wrapUserName, {fontWeight: 'regular'}]}>Role: </Text>
                <Text style={styles.wrapUserName}>{user?.role}</Text>
            </View>


            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
                <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text
                            style={{
                                fontSize: 15,

                                marginLeft: 5,
                            }}
                        >
                            About Us
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text
                            style={{
                                fontSize: 15,

                                marginLeft: 5,
                            }}
                        >
                            License
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ paddingVertical: 15 }} onPress={() => dispatch(logout())}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>

                        <Text
                            style={{
                                fontSize: 15,

                                marginLeft: 5,
                            }}
                        >
                            Sign Out
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CustomDrawer;

const styles = StyleSheet.create({
    userAvatar: {
        height: 67.5,
        width: 67.5,
        borderRadius: 40,
        marginBottom: 10,
        marginTop: 30,
    },
    switchTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 7,
        paddingVertical: 5,
    },
    preferences: {
        fontSize: 16,
        color: "#ccc",
        paddingTop: 10,
        fontWeight: "500",
        paddingLeft: 20,
    },
    switchText: {
        fontSize: 17,
        color: "",
        paddingTop: 10,
        fontWeight: "bold",
    },
    wrapInfo: {
        marginLeft: 20,
        marginBottom: 12,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    wrapUserName: {
        fontWeight: 'bold',
        fontSize: 17,
    }
});
