import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';

import Routes from './Routes';
import Logo from '../components/template/Logo';
import Nav from '../components/template/Nav';
import Footer from '../components/template/Footer';

function App(props) {
    return (
        <BrowserRouter>
            <div className="app">
                <Logo />
                <Nav icon_home = "home" title_inicio = "Home" icon_file_text = "file-text" title_financas = "Finanças" />
                <Routes />
                <Footer />
            </div>
        </BrowserRouter>
    )
}

export default App;