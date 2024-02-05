import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import endpoints from "../../../constants/env.dev";

const initialState = {
    loading: false,
    screeningApisData: [],
    error: {}
}

// create actions - pending, fulfilled, and rejected
export const fetchScreeningAPIs = createAsyncThunk('screeningAPIs/fetchScreeningAPIs', async () => {
    return axios.get(endpoints.baseUrl + endpoints.screeningAPIs.getScreeningAPIs).then((res) => res.data);
});

const screeningAPIsSlice = createSlice({
    name: 'screeningAPIs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Screening APIs Fetch Operation
        builder.addCase(fetchScreeningAPIs.pending, (state) => {
            state.loading = true;
            return state;
        });
        builder.addCase(fetchScreeningAPIs.fulfilled, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.screeningApisData = action.payload;
            return state;
        });
        builder.addCase(fetchScreeningAPIs.rejected, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.screeningApisData = [];
            state.error = action.error.message;
            return state;
        });
    }
});

export default screeningAPIsSlice.reducer;