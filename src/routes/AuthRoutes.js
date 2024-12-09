import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from '../components/Layout'
import DashBord from '../pages/DashBord'
import User from '../pages/User'
import Size from '../pages/Size'
import Category from '../pages/Category'
import SubCategory from '../pages/SubCategory'
import Stock from '../pages/Stock'
import Review from '../pages/Review'
import Coupons from '../pages/Coupons'
import ProductOffer from '../pages/ProductOffer'
import AddProductOffer from '../pages/AddProductOffer'
import Product from '../pages/Product'
import AddProduct from '../pages/ProductAdd'
import Offer from '../pages/Offer'
import ProductView from '../pages/ProductView'
import ReturnOrder from '../pages/ReturnOrder'
import ReturnOrderView from '../pages/ReturnOrderView'
import Orders from '../pages/Orders'
import OrderView from '../pages/OrderView'
import InvoiceList from '../pages/InvoiceList'
import ProtectedRoute from './ProtectedRoute'
import InvoiceView from '../pages/InvoiceView'

export default function AuthRoutes() {
    return (
        <div>
            <ProtectedRoute>
                <Layout>
                    <Routes>
                        <Route path="/dashboard" element={<DashBord />} />
                        <Route path="/user" element={<User />} />
                        <Route path="/size" element={<Size />} />
                        <Route path="/category" element={<Category />} />
                        <Route path="/subcategory" element={<SubCategory />} />
                        <Route path="/products" element={<Product />} />
                        <Route path="/products/productAdd" element={<AddProduct />} />
                        <Route path="/products/productView" element={<ProductView />} />
                        <Route path="/stoke" element={<Stock />} />
                        <Route path="/order" element={<Orders />} />
                        <Route path="/order/view/:id" element={<OrderView />} />
                        <Route path="/review" element={<Review />} />
                        <Route path="/coupons" element={<Coupons />} />
                        <Route path="/product-offer" element={<ProductOffer />} />
                        <Route path="/product-offer/add" element={<AddProductOffer />} />
                        <Route path="/offers" element={<Offer />} />
                        <Route path="/return-order" element={<ReturnOrder />} />
                        <Route path="/return-order/view" element={<ReturnOrderView />} />
                        <Route path="/invoice" element={<InvoiceList />} />
                        <Route path="/invoice/view" element={<InvoiceView />} />      
                    </Routes>
                </Layout>
            </ProtectedRoute>
        </div>
    )
}
