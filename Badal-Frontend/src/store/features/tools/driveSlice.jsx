import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import endpoints from '../../../constants/env.dev';
import prod from '../../../constants/env.prod';

const initialState = {
    loading: false,
    driveList: [],
    driveDetails: {},
    formList: [],
    success: null,
    assistantList: [],
    medicalAssistantList: [],
    fieldList: [],
    error: null
};

// create actions - pending, fulfilled, and rejected
export const fetchAllDrives = createAsyncThunk('drive/fetchAllDrives', async (driveId) => {
    // return axios.get(endpoints.baseUrl + endpoints.drives.getAllDrives).then((res) => res.data);
    return axios.get(prod.baseUrl + prod.drives.getAllDrives).then((res) => res.data);
});

export const fetchDriveDetails = createAsyncThunk('drive/fetchDriveDetails', async (driveId) => {
    return axios.get(endpoints.baseUrl + endpoints.drives.getDriveDetails).then((res) => res.data);
});

export const fetchAllForms = createAsyncThunk('drive/fetchAllForms', async () => {
    // return axios.get(endpoints.baseUrl + endpoints.drives.getAllForms).then((res) => res.data);
    return axios.get(prod.baseUrl + prod.drives.getAllForms).then((res) => res.data);
});

export const fetchAllAssistants = createAsyncThunk('drive/fetchAllAssistants', async (orgId="ORG_001") => {
    // return axios.get(endpoints.baseUrl + endpoints.drives.getAllAssistants).then((res) => res.data);
    return axios.get(prod.baseUrl + prod.drives.getAllAssistants + '/' + orgId).then((res) => res.data);
});

export const fetchAllMedicalAssistants = createAsyncThunk('drive/fetchAllMedicalAssistants', async () => {
    return axios.get(endpoints.baseUrl + endpoints.drives.getAllMedicalAssistants).then((res) => res.data);
});

export const fetchAllFields = createAsyncThunk('drive/fetchAllFields', async () => {
    // return axios.get(endpoints.baseUrl + endpoints.drives.getAllFields).then((res) => res.data);
    return axios.get(prod.baseUrl + prod.drives.getAllFields).then((res) => res.data);
});

export const saveFormData = createAsyncThunk('drive/saveFormData', async (formData) => {
    // return new Promise((resolve, reject) => {
    //     resolve({ success: "Success" });
    // });
    return axios.post(prod.baseUrl + prod.drives.saveFormData, formData).then((res) => res.data);
});

export const saveDrive = createAsyncThunk('drive/saveDrive', async (driveData) => {
    // return new Promise((resolve, reject) => {
    //     resolve({ success: "Success" });
    // });
    return axios.post(prod.baseUrl + prod.drives.saveDriveData, driveData).then((res) => res.data);
});

const driveSlice = createSlice({
    name: 'drive',
    initialState,
    reducers: {
        resetSuccess: (state) => {
            console.log("Resetting success");
            state = { ...state };
            state.success = null;
            return state;
        },
        resetError: (state) => {
            state = { ...state };
            state.error = null;
            return state;
        }
    },
    extraReducers: (builder) => {
        // Drive Info Fetch Operation
        builder.addCase(fetchAllDrives.pending, (state) => {
            state.loading = true;
            return state;
        });
        builder.addCase(fetchAllDrives.fulfilled, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.driveList = action.payload.drives;
            return state;
        });
        builder.addCase(fetchAllDrives.rejected, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.driveList = {};
            state.error = action.error.message;
            state.success = null;
            return state;
        });

        // Drive Details Fetch Operation
        builder.addCase(fetchDriveDetails.pending, (state) => {
            state = { ...state };
            state.loading = true;
            return state;
        });

        builder.addCase(fetchDriveDetails.fulfilled, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.driveDetails = action.payload;
            return state;
        });

        builder.addCase(fetchDriveDetails.rejected, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.driveDetails = {};
            state.error = action.error.message;
            state.success = null;
            return state;
        });

        // All Forms Fetch Operation
        builder.addCase(fetchAllForms.pending, (state) => {
            state = { ...state };
            state.loading = true;
            return state;
        });
        builder.addCase(fetchAllForms.fulfilled, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.formList = action.payload.forms;
            return state;
        });
        builder.addCase(fetchAllForms.rejected, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.formList = [];
            state.error = action.error.message;
            state.success = null;
            return state;
        });

        // All Assistants Fetch Operation
        builder.addCase(fetchAllAssistants.pending, (state) => {
            state = { ...state };
            state.loading = true;
            return state;
        });
        builder.addCase(fetchAllAssistants.fulfilled, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.assistantList = action.payload.assistants;
            return state;
        });
        builder.addCase(fetchAllAssistants.rejected, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.assistantList = [];
            state.error = action.error.message;
            state.success = null;
            return state;
        });

        // All Medical Assistants Fetch Operation
        builder.addCase(fetchAllMedicalAssistants.pending, (state) => {
            state = { ...state };
            state.loading = true;
            return state;
        });
        builder.addCase(fetchAllMedicalAssistants.fulfilled, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.medicalAssistantList = action.payload.medicalAssistants;
            return state;
        });
        builder.addCase(fetchAllMedicalAssistants.rejected, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.medicalAssistantList = [];
            state.error = action.error.message;
            state.success = null;
            return state;
        });

        // All Fields Fetch Operation
        builder.addCase(fetchAllFields.pending, (state) => {
            state = { ...state };
            state.loading = true;
            return state;
        });
        builder.addCase(fetchAllFields.fulfilled, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.fieldList = action.payload.fields;
            return state;
        });
        builder.addCase(fetchAllFields.rejected, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.fieldList = [];
            state.error = action.error.message;
            state.success = null;
            return state;
        });

        // Save Form Data Operation
        builder.addCase(saveFormData.pending, (state) => {
            state = { ...state };
            state.loading = true;
            return state;
        });
        builder.addCase(saveFormData.fulfilled, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.success = action.payload;
            return state;
        });
        builder.addCase(saveFormData.rejected, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.success = null;
            state.error = action.error.message;
            return state;
        });

        // Save Drive Data Operation
        builder.addCase(saveDrive.pending, (state) => {
            state = { ...state };
            state.loading = true;
            return state;
        });
        builder.addCase(saveDrive.fulfilled, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.success = action.payload;
            return state;
        });
        builder.addCase(saveDrive.rejected, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.success = null;
            state.error = action.error.message;
            return state;
        });
    }
});

export default driveSlice.reducer;
export const { resetSuccess, resetError } = driveSlice.actions;