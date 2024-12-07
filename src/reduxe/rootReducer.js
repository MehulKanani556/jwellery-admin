import { combineReducers } from "redux";
import authSlice from "./slice/auth.slice";
import usersSlice from "./slice/users.slice";

import sizeSlice from "./slice/size.slice";

import categorysSlice from "./slice/catagorys.slice";
import subcategorysSlice from "./slice/subcategorys.slice";
import stokeSlice from "./slice/stoke.slice";
import productSlice from "./slice/product.slice";
import reviewSlice from "./slice/review.slice";
import couponsSlice from "./slice/coupons.slice";
import productofferSlice from "./slice/productoffer.slice";
import offerSlice from "./slice/offer.slice";
import returnorderSlice from "./slice/returnorder.slice";
import ordersSlice from "./slice/orders.slice";
import dashboardSlice from "./slice/dashboard.slice";


export const rootReducer = combineReducers({
    auth:authSlice,
    dashboard:dashboardSlice,
    users:usersSlice,
    sizes:sizeSlice,
    categorys:categorysSlice,
    subcategorys:subcategorysSlice,
    stocks:stokeSlice,
    products:productSlice,
    reviews:reviewSlice,
    coupons:couponsSlice,
    productoffers:productofferSlice,
    offers:offerSlice,
    returnorders:returnorderSlice,
    orders:ordersSlice,

});
