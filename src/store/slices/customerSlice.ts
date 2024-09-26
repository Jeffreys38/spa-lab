import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Customer from '@/src/models/Customer'; // Ensure you have a Customer model
import DatabaseHelper from "@/src/helpers/DatabaseHelper";

export const fetchCustomers = createAsyncThunk('customer/fetchCustomers', async () => {
    const dbHelper = new DatabaseHelper<Customer>('customers'); // Change to 'customers'
    const customers = await dbHelper.getAll();
    return customers || [];
});

interface CustomerState {
    customers: Customer[]; // Change from services to customers
    loading: boolean;
    error: string | null;
}

const initialState: CustomerState = {
    customers: [], // Change from services to customers
    loading: false,
    error: null,
};

export const customerSlice = createSlice({
    name: 'customer', // Update name to customer
    initialState,
    reducers: {
        addCustomer: (state, action: PayloadAction<Customer>) => {
            state.customers.push(action.payload); // Change from services to customers
        },
        deleteCustomer: (state, action: PayloadAction<string>) => {
            state.customers = state.customers.filter(customer => customer.id !== action.payload); // Change from services to customers
        },
        updateCustomer: (state, action: PayloadAction<Customer>) => {
            const index = state.customers.findIndex(customer => customer.id === action.payload.id); // Change from services to customers
            if (index !== -1) {
                state.customers[index] = action.payload; // Change from services to customers
            }
        },
        updateCustomers: (state, action: PayloadAction<Customer[]>) => {
            state.customers = action.payload; // Change from services to customers
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
                state.loading = false;
                state.customers = action.payload; // Change from services to customers
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch customers'; // Change from users to customers
            });
    },
});

export const { addCustomer, deleteCustomer, updateCustomer, updateCustomers } = customerSlice.actions;

export default customerSlice.reducer;
