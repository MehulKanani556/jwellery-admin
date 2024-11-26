import logo from './logo.svg';
import './App.css';
import { configureStore } from './reduxe/store';
import { Provider } from 'react-redux';
function App() {
  const { store, persistor } = configureStore();
  return (
    <>

      <Provider store={store}>
        
      </Provider>
    </>
  );
}

export default App;
