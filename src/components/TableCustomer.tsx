import * as React from 'react';
import { DataTable, ActivityIndicator, MD2Colors } from 'react-native-paper';
import DatabaseHelper from '@/src/helpers/DatabaseHelper';
import CustomerModel from '@/src/models/Customer';
import { updateCustomers, deleteCustomer } from "@/src/store/slices/customerSlice";
import { AppDispatch, RootState } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useMessageContext } from "@/src/context/MessageContext";
import { Provider as PaperProvider } from 'react-native-paper';
import { router, useNavigation } from "expo-router";

const Table = () => {
    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([2, 3, 4, 10]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
    const [items, setItems] = React.useState<CustomerModel[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false); // New loading state
    const dbHelper = new DatabaseHelper<CustomerModel>('customers');
    const dispatch: AppDispatch = useDispatch();
    const { customers } = useSelector((state: RootState) => state.customer);
    const navigation = useNavigation();

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    const { isShowMessageOpen, setShowMessageOpen, setMessage } = useMessageContext();

    React.useEffect(() => {
        const fetchData = async () => {
            const data = await dbHelper.getAll();
            if (data) {
                setItems(data);
                dispatch(updateCustomers(data));
            }
        };

        fetchData();
    }, []);

    React.useEffect(() => {
        setItems(customers);
    }, [customers]);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const handleDelete = async (id: string) => {
        try {
            setLoading(true); // Set loading state to true
            await dbHelper.delete(id);
            dispatch(deleteCustomer(id));
            setMessage("Deleted Successfully", false);
            setShowMessageOpen(true);
        } catch (error) {
            setMessage("An error occurred while deleting the customer", true);
            setShowMessageOpen(true);
        } finally {
            setLoading(false); // Reset loading state regardless of success or error
        }
    };

    const handleDetail = async (id: string) => {
        router.push(`/detail/${id}`);
    };

    return (
        <PaperProvider>
            {loading && (
                <ActivityIndicator
                    animating={true}
                    color={MD2Colors.red500}
                    style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }] }}
                />
            )}
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Email</DataTable.Title>
                    <DataTable.Title>Name</DataTable.Title>
                    <DataTable.Title numeric>Phone Number</DataTable.Title>
                    <DataTable.Title numeric>Action</DataTable.Title>
                </DataTable.Header>

                {items.slice(from, to).map((item) => (
                    <DataTable.Row key={item.id} onPress={() => { handleDetail(item.id); }} style={{ opacity: loading ? 0.5 : 1 }}>
                        <DataTable.Cell>{item.email}</DataTable.Cell>
                        <DataTable.Cell>{item.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.phoneNumber}</DataTable.Cell>
                        <DataTable.Cell numeric onPress={() => { handleDelete(item.id); }} disabled={loading}>
                            <EvilIcons name="trash" size={24} color="red" />
                        </DataTable.Cell>
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
