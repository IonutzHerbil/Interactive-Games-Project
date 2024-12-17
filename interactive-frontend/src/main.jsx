import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; // App component that fetches message
import TicTacToe from './pages/TicTacToe'; // TicTacToe component
import Minesweeper from './pages/Minesweeper';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/TicTacToe" element={<TicTacToe />} />
      <Route path="/Minesweeper" element={<Minesweeper/>}/>
    </Routes>
  </Router>
);
