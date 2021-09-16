import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import PageHome from '../components/home/Home';
import PageCadastrar from '../components/lancamentos/lancamentoCad';
import PageVisualizar from '../components/lancamentos/lancamentoVisu';
import PageEditar from '../components/lancamentos/lancamentoEdit';

function Rotas(props) {
    return (
        <Switch>
            <Route exact path='/' component={PageHome} />
            <Route path='/cadastrar' component={PageCadastrar} />
            <Route path='/finanças' component={PageVisualizar} />
            <Route path='/editar/:id' component={PageEditar} />
            <Redirect from='*' to='/' />
        </Switch>
    )
}

export default Rotas;