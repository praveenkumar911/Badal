import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import endpoints from "../../../constants/env.dev";


const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'admin',
    loading: false,
    id: 60
}

export const loginUser = createAsyncThunk('user/userLogin', async (username, password) => {
    let payload = {
        username: username,
        password: password
    }
    
    return axios.post(endpoints.baseUrl + endpoints.user.login, payload).then((res) => res.data);
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            return state;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.id = action.payload.userId;
            return state;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state = { ...state };
            state.loading = false;
            state.firstName = '';
            state.lastName = '';
            state.email = '';
            state.role = '';
            state.id = '';
            return state;
        });
    }
});

export default userSlice.reducer;