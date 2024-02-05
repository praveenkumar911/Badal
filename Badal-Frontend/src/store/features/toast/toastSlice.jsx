import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    showToast: false,
    toastType: '',
    toastMessage: ''
}

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        showToast: (state, action) => {
            state.showToast = true;
            state.toastType = action.payload.toastType;
            state.toastMessage = action.payload.toastMessage;
        },
        resetToast: (state) => {
            state.showToast = false;
            state.toastType = '';
            state.toastMessage = '';
        }
    }
});

export default toastSlice.reducer
export const { showToast, resetToast } = toastSlice.actions