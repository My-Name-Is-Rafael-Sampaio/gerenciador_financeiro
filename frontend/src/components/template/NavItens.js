import React from 'react';
import { Link } from 'react-router-dom';

function ItensDaNav(props) {
    return (
        <React.Fragment>
            <Link to="/">
                <i className={`fa fa-${props.icon_home}`}></i> {props.title_inicio}
            </Link>
            <Link to="/finanças">
                <i className={`fa fa-${props.icon_file_text}`}></i> {props.title_financas}
            </Link>
        </React.Fragment>
    )
}

export default ItensDaNav;