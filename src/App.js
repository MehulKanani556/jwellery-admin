
import "./App.css";
import { configureStore } from "./reduxe/store";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPass from "./pages/ForgotPass";
import VerifyOtp from "./pages/VerifyOtp";
import RestPass from "./pages/RestPass";
import AuthRoutes from "./routes/AuthRoutes";

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
          <Route path="/*" element={<AuthRoutes />}></Route>
        </Routes>

      </Provider>
    </>
  );
}

export default App;
