import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Service from '@/src/models/Service';
import DatabaseHelper from "@/src/helpers/DatabaseHelper";

export const fetchService = createAsyncThunk('user/fetchServices', async () => {
    const dbHelper = new DatabaseHelper<Service>('services');
    const services = await dbHelper.getAll();
    return services || [];
});

interface ServiceState {
    services: Service[];
    loading: boolean;
    error: string | null;
}

const initialState: ServiceState = {
    services: [],
    loading: false,
    error: null,
};

export const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {
        addService: (state, action: PayloadAction<Service>) => {
            state.services.push(action.payload);
        },
        deleteService: (state, action: PayloadAction<string>) => {
            state.services = state.services.filter(service => service.id !== action.payload);
        },
        updateService: (state, action: PayloadAction<Service>) => {
            const index = state.services.findIndex(service => service.id === action.payload.id);
            if (index !== -1) {
                state.services[index] = action.payload;
            }
        },
        updateServices: (state, action: PayloadAction<Service[]>) => {
            state.services = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchService.fulfilled, (state, action: PayloadAction<Service[]>) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch users';
            });
    },
});

export const { addService, deleteService, updateService, updateServices } = serviceSlice.actions;

export default serviceSlice.reducer;
