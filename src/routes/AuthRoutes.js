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


export default function AuthRoutes() {
    return (
        <div>
            <Layout>
                <Routes>
                    <Route path="/dashboard" element={<DashBord />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/size" element={<Size />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/subcategory" element={<SubCategory />} />
                    <Route path="/stoke" element={<Stock />} />
                    <Route path="/review" element={<Review />} />
                    <Route path="/coupons" element={<Coupons />} />
                    <Route path="/product-offer" element={<ProductOffer />} />
                    <Route path="/product-offer/add" element={<AddProductOffer />} />

                </Routes>
            </Layout>

        </div>
    )
}
