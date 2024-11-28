import { combineReducers } from "redux";
import authSlice from "./slice/auth.slice";
import usersSlice from "./slice/users.slice";

import sizeSlice from "./slice/size.slice";

import categorysSlice from "./slice/catagorys.slice";
import subcategorysSlice from "./slice/subcategorys.slice";


export const rootReducer = combineReducers({
    auth:authSlice,
    users:usersSlice,
    sizes:sizeSlice,
    categorys:categorysSlice,
    subcategorys:subcategorysSlice,
});
