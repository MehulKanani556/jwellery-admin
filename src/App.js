import logo from './logo.svg';
import './App.css';
import { configureStore } from './reduxe/store';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPass from './pages/ForgotPass';
import VerifyOtp from './pages/VerifyOtp';
import RestPass from './pages/RestPass';

import DashBord from './pages/DashBord';
import User from './pages/User';

import ResponsiveDrawer from './components/Layout';

function App() {
  const { store, persistor } = configureStore();
  return (
    <>

      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<RestPass />} />

          <Route path="/dashboard" element={<DashBord />} />
          <Route path="/user" element={<User />} />
         

          <Route path="/layout" element={<ResponsiveDrawer />} />

        </Routes>
      </Provider>
    </>
  );
}

export default App;
