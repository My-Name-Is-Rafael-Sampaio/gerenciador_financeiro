import React from 'react';
import {Link} from 'react-router-dom';

import logo from '../../assets/imgs/logo/logo.png';

import './Logo.css'

function Logo(props){
    return(
        <aside className="logo">
            <Link to="/" className="logo">
                <img src={logo} alt="logo" />
            </Link>
        </aside>
    )
}

export default Logo;