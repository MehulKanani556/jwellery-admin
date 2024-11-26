import logo from './logo.svg';
import './App.css';
import { configureStore } from './reduxe/store';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
function App() {
  const { store, persistor } = configureStore();
  return (
    <>

      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Login />} />
         
        </Routes>
      </Provider>
    </>
  );
}

export default App;
