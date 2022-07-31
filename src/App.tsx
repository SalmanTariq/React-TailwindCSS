import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Routes } from './Components/Routes/Routes';

function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

export default App;
