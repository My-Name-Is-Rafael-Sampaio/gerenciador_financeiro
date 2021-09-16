import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Main from '../template/Main';
import api from '../../config/configApi';

import './lancamentoCad.css';

const CreateLancamento = () => {

    const [lancamento, setLancamento] = useState({
        nome: '',
        valor: '',
        tipo: '',
        situacao: '',
        dataPagamento: ''
    });

    const [status, setStatus] = useState({
        type: '',
        msg: ''
    });

    const valorInput = e => setLancamento({ ...lancamento, [e.target.name]: e.target.value });

    const [valorLancTarget, setValorLancTarget] = useState('');

    const valorLancamento = async e => {
        let valorLancamentoInput = e.target.value;

        valorLancamentoInput = valorLancamentoInput.replace(/\D/g, "");
        valorLancamentoInput = valorLancamentoInput.replace(/(\d)(\d{2})$/, "$1,$2");
        valorLancamentoInput = valorLancamentoInput.replace(/(?=(\d{3})+(\D))\B/g, ".");

        setValorLancTarget(valorLancamentoInput);

        let valorSalvar = await valorLancamentoInput.replace(".", "");
        valorSalvar = await valorSalvar.replace(",", ".");

        setLancamento({ ...lancamento, valor: valorSalvar });
    }

    const cadLancamento = async e => {
        e.preventDefault();

        const headers = {
            'Content-Type': 'application/json'
        }

        await api.post("/cadastrar", lancamento, { headers })
            .then((response) => {
                setStatus({
                    type: 'success',
                    msg: response.data.msg
                });
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        msg: err.response.data.msg
                    });
                } else {
                    setStatus({
                        type: 'error',
                        msg: 'Erro: Conexão com o servidor foi perdida!'
                    });
                }
            })
    }

    return (
        <Main icon="file-text" title="Cadastrar um lançamento" subtitle="Tela de cadastro de lançamentos.">

            <div className="alert">
                {status.type === 'error' ? <span className="spanDanger">{status.msg}</span> : ""}
                {status.type === 'success' ? <span className="spanSuccess">{status.msg}</span> : ""}
            </div>

            <div className="conteudoTitulo">
                <h1>Formulário de Cadastro</h1>
                <Link to="/finanças">
                    <button className="btn btn-outline-secondary">
                        <i className="fa fa-arrow-left"></i>
                        Voltar
                    </button>
                </Link>
            </div>

            <form onSubmit={cadLancamento}>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control" name="nome" placeholder="Conta de Água" onChange={valorInput} />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Valor</label>
                            <input type="text" className="form-control" name="valor" placeholder="100,00" value={valorLancTarget} onChange={valorLancamento} />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Tipo</label>
                            <select className="form-control" name="tipo" onChange={valorInput}>
                                <option value="">Selecione</option>
                                <option value="1">Pagamento</option>
                                <option value="2">Recebido</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Situação</label>
                            <select className="form-control" name="situacao" onChange={valorInput}>
                                <option value="">Selecione</option>
                                <option value="1">Pago</option>
                                <option value="2">Pendente</option>
                                <option value="3">Recebido</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Data</label>
                        <input type="date" className="form-control" name="dataPagamento" onChange={valorInput} />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button type="submit" className="btn btn-outline-primary">
                            <i className="fa fa-floppy-o"></i>
                            Cadastrar
                        </button>
                    </div>
                </div>
            </form>
        </Main>
    )
}

export default CreateLancamento;