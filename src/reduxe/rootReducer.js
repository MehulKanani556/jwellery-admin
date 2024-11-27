import { combineReducers } from "redux";
import authSlice from "./slice/auth.slice";
import usersSlice from "./slice/users.slice";

export const rootReducer = combineReducers({
    auth:authSlice,
    users:usersSlice
});
