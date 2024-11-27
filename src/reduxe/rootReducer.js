import { combineReducers } from "redux";
import authSlice from "./slice/auth.slice";


export const rootReducer = combineReducers({
    auth:authSlice
});
