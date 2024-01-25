import { configureStore } from "@reduxjs/toolkit";
import navReducer from "../features/nav/navSlice";
import driveReducer from "../features/tools/driveSlice";
import screenApiReducer from "../features/tools/apiSlice";
import userReducer from "../features/user/userSlice";
import toastReducer from "../features/toast/toastSlice";

const store = configureStore({
   reducer: {
        user: userReducer,
        toast: toastReducer,
        nav: navReducer,
        drive: driveReducer,
        screenApi: screenApiReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export default store;