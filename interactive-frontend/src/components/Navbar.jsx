//Navbar
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/TicTacToe">Tic Tac Toe</Link></li>
                <li><Link to='/Minesweeper'>Minesweeper</Link></li>
                <li><Link to='/MemoryMatrix'>Memory Matrix</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
