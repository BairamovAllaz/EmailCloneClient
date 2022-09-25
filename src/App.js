import logo from './logo.svg';
import './App.css';
import Enter from './components/Enter';
import Home from './components/Home';
import {
  BrowserRouter,
  Routes,
  Navigate,
  Route,
  Switch,
} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Enter />} />
          <Route path="/:userName" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
