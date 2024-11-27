import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from '../components/Layout'
import DashBord from '../pages/DashBord'
import User from '../pages/User'

export default function AuthRoutes() {
    return (
        <div>
            <Layout>
                <Routes>
                    <Route path="/dashboard" element={<DashBord />} />
                    <Route path="/user" element={<User />} />
                </Routes>
            </Layout>

        </div>
    )
}
