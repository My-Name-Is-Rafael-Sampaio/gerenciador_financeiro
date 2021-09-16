import React from 'react';

import NavItens from './NavItens';

import './Nav.css';

function Nav(props) {
    return (
        <React.Fragment>
            <aside className="menu-area">
                <nav className="menu">
                    <NavItens {...props}/>
                </nav>
            </aside>
        </React.Fragment>
    )
}

export default Nav;