import React from 'react';

import Main from '../template/Main';

function Home(props) {
    return (
        <Main icon="home" title="Início" subtitle="tela de Boa vinda ao sistema.">
            <div className="display-4">Bem Vindo!</div>
            <hr />
            <p className="mb-0">Sistema de gerenciamento financeiro, desenvolvido em React!</p>
        </Main>
    )
}

export default Home;