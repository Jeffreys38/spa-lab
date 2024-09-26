import * as React from 'react';
import { DataTable } from 'react-native-paper';
import DatabaseHelper from '@/src/helpers/DatabaseHelper';
import User from '@/src/models/User';
import {updateUsers, deleteUser} from "@/src/store/slices/userSlice";
import {AppDispatch, RootState} from "@/src/store";
import {useDispatch, useSelector} from "react-redux";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import {useMessageContext} from "@/src/context/MessageContext";
import { Provider as PaperProvider } from 'react-native-paper';
import {router, useNavigation} from "expo-router";

const Table = () => {
    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([2, 3, 4, 10]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
    const [items, setItems] = React.useState<User[]>([]); // Assuming User is the type for your data
    const dbHelper = new DatabaseHelper<User>('users'); // Adjust collection name as necessary
    const dispatch: AppDispatch = useDispatch();
    const { users } = useSelector((state: RootState) => state.user);
    const navigation = useNavigation();

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    const { isShowMessageOpen, setShowMessageOpen, setMessage } = useMessageContext();

    React.useEffect(() => {
        const fetchData = async () => {
            const data = await dbHelper.getAll();
            if (data) {
                setItems(data);
                dispatch(updateUsers(data));
            }
        };

        fetchData();
    }, []);

    React.useEffect(() => {
        setItems(users);
    }, [users]);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const handleDelete = async (id: string) => {
        try {
            dispatch(deleteUser(id));
            await dbHelper.delete(id);
            setMessage("Delete Successfully", false);
            setShowMessageOpen(true);

        } catch(error) {
            setMessage("An error while deleting user", true);
            setShowMessageOpen(true);
        }
    };

    const handleDetail = async (id: string) => {
        router.push(`/detail/${id}`);
    }

    return (
        <PaperProvider>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Email</DataTable.Title>
                    <DataTable.Title numeric>Name</DataTable.Title>
                    <DataTable.Title numeric>Age</DataTable.Title>
                    <DataTable.Title numeric>Action</DataTable.Title>
                </DataTable.Header>

                {items.slice(from, to).map((item) => (
                    <DataTable.Row key={item.id} onPress={() => {handleDetail(item.id)}}>
                        <DataTable.Cell>{item.email}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.age}</DataTable.Cell>
                        <DataTable.Cell numeric onPress={() => { handleDelete(item.id); }}><EvilIcons name="trash" size={24} color="red" /></DataTable.Cell>
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(items.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${items.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showFastPaginationControls
                    selectPageDropdownLabel={'Rows per page'}
                />
            </DataTable>
        </PaperProvider>
    );
};

export default Table;
