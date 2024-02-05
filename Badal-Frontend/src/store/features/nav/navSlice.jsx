import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    isNavExp: false,
    title: localStorage.getItem("pageTitle") || "Home"
}

const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        toggle: (state) => {
            state.isNavExp = !state.isNavExp
        },
        changeTitle: (state, action) => {
            state.title = action.payload
            localStorage.setItem("pageTitle", state.title)
        }
    }
});

export default navSlice.reducer
export const { toggle, changeTitle } = navSlice.actions