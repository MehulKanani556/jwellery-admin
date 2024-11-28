import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from '../components/Layout'
import DashBord from '../pages/DashBord'
import User from '../pages/User'

import sessionStorage from 'redux-persist/es/storage/session'
import Size from '../pages/Size'

import Category from '../pages/Category'
import SubCategory from '../pages/SubCategory'


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

                </Routes>
            </Layout>

        </div>
    )
}
