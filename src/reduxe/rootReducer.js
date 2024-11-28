import { combineReducers } from "redux";
import authSlice from "./slice/auth.slice";
import usersSlice from "./slice/users.slice";
import categorysSlice from "./slice/catagorys.slice";
import subcategorysSlice from "./slice/subcategorys.slice";

export const rootReducer = combineReducers({
    auth:authSlice,
    users:usersSlice,
    categorys:categorysSlice,
    subcategorys:subcategorysSlice
});
