import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from '../components/Layout'
import DashBord from '../pages/DashBord'
import User from '../pages/User'
import Category from '../pages/Category'
import SubCategory from '../pages/SubCategory'

export default function AuthRoutes() {
    return (
        <div>
            <Layout>
                <Routes>
                    <Route path="/dashboard" element={<DashBord />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/subcategory" element={<SubCategory />} />
                </Routes>
            </Layout>

        </div>
    )
}
