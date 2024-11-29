import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Fetching data...');
    axios.get('http://localhost:8080/Home')
      .then(response => {
        setMessage(response.data); 
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
      <nav>
        <Link to="/TicTacToe">Go to TicTacToe</Link>
      </nav>
    </div>
  );
}

export default App;
