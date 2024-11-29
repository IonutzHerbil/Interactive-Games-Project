import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; // App component that fetches message
import TicTacToe from './pages/TicTacToe'; // TicTacToe component

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/TicTacToe" element={<TicTacToe />} />
    </Routes>
  </Router>
);
