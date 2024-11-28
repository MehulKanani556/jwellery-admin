import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from '../components/Layout'
import DashBord from '../pages/DashBord'
import User from '../pages/User'
import sessionStorage from 'redux-persist/es/storage/session'
import Size from '../pages/Size'

export default function AuthRoutes() {
    return (
        <div>
            <Layout>
                <Routes>
                    <Route path="/dashboard" element={<DashBord />} />
                    <Route path="/user" element={<User />} />

                    <Route path="/size" element={<Size />} />
                </Routes>
            </Layout>

        </div>
    )
}
