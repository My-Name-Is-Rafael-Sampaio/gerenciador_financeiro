import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import Main from '../template/Main';
import api from '../../config/configApi';

import './lancamentoVisu.css';

const ViewLancamentos = () => {

    moment.locale();

    const [data, setData] = useState([]);
    const [deposito, setDeposito] = useState("");
    const [pago, setPago] = useState("");
    const [pendente, setPendente] = useState("");
    const [saldo, setSaldo] = useState("");

    let dataAtual = new Date();
    let ano = dataAtual.getFullYear();
    let mes = dataAtual.getMonth() + 1;

    const [dataView, setDataView] = useState({
        mes,
        ano
    });

    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    });

    const anterior = async () => {
        if (dataView.mes === 1) {
            mes = 12;
            ano = dataView.ano - 1;
            setDataView({
                mes,
                ano
            });
            listarExtrato(mes, ano);
        } else {
            mes = dataView.mes - 1;
            ano = dataView.ano;
            setDataView({
                mes,
                ano
            });
            listarExtrato(mes, ano);
        }
    };

    const proximo = async () => {
        if (dataView.mes === 12) {
            mes = 1;
            ano = dataView.ano + 1;
            setDataView({
                mes,
                ano
            });
            listarExtrato(mes, ano);
        } else {
            mes = dataView.mes + 1;
            ano = dataView.ano;
            setDataView({
                mes,
                ano
            });
            listarExtrato(mes, ano);
        }
    }

    const listarExtrato = async (mes, ano) => {

        if ((mes === undefined) && (ano === undefined)) {
            let dataAtual = new Date();
            mes = dataAtual.getMonth() + 1;
            ano = dataAtual.getFullYear();
        }

        await api.get("/listar/" + mes + "/" + ano)
            .then((response) => {
                setData(response.data.lancamentos);
                setDeposito(response.data.valorRecebido);
                setPago(response.data.valorPago);
                setPendente(response.data.valorPendente)
                setSaldo(response.data.saldo);
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'erro',
                        msg: err.response.data.msg
                    });
                } else {
                    setStatus({
                        type: 'erro',
                        msg: 'Erro: Tente mais tarde!'
                    });
                }
            });
    }

    const apagarLancamento = async (idLancamento) => {

        const headers = {
            'Content-Type': 'application/json'
        }

        await api.delete("/apagar/" + idLancamento, { headers })
            .then((response) => {
                setStatus({
                    type: 'success',
                    msg: response.data.msg
                });
                listarExtrato();
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'erro',
                        msg: err.response.data.msg
                    });
                } else {
                    setStatus({
                        type: 'erro',
                        msg: "Erro: Tente mais tarde!"
                    });
                }
            });
    }

    useEffect(() => {
        listarExtrato();
    }, []);

    return (
        <Main icon="file-text" title="Lançamentos" subtitle="Tela de visualição dos lançamentos.">
            <div className="alert">
                {status.type === 'erro' ? <span className="spanDanger">{status.msg}</span> : ""}
                {status.type === 'success' ? <span className="spanSuccess">{status.msg}</span> : ""}
            </div>

            <div className="conteudoTitulo">
                <h1>Tabela do Mês {`${dataView.mes} / ${dataView.ano}`}</h1>
                <Link to="/cadastrar">
                    <button className="btn btn-outline-success">
                        <i className="fa fa-plus"></i>
                        Cadastrar
                    </button>
                </Link>
            </div>

            <div className="btnAnteriorEProximo">
                <button className="btn btn-primary" onClick={() => anterior()}>
                    Anterior
                </button>
                <h3>Lançamentos</h3>
                <button className="btn btn-primary" onClick={() => proximo()}>
                    Próximo
                </button>
            </div>

            <div className="table-responsive">
                <table className="table mt-4 table-bordered">
                    <thead>
                        <tr className="bg-dark">
                            <th>Id</th>
                            <th>Nome</th>
                            <th>Tipo</th>
                            <th>Situação</th>
                            <th>Data de Pagamento</th>
                            <th>Valor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id} className="table-secondary">
                                <td>{item.id}</td>
                                <td>{item.nome}</td>
                                <td>{item.tipo === 1 ? <span className="spanRed">Pagamento</span> : <span className="spanGreen">Recebido</span>}</td>
                                <td>{item.situacao === 1 ? <span className="spanRed">Pago</span> : item.situacao === 2 ? <span className="spanYellow">Pendente</span > : item.situacao === 3 ? <span className="spanGreen">Recebido</span> : ""}</td>
                                <td>{moment.utc(item.dataPagamento).format('DD/MM/YYYY')}</td>
                                <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}</td>
                                <td>
                                    <div className="btnEditarEApagar">
                                        <Link to={`/editar/${item.id}`}>
                                            <button className="btn btn-warning">
                                                <i className="fa fa-pencil"></i>
                                            </button>
                                        </Link>
                                        <Link to="#">
                                            <button className="btn btn-danger ml-2" onClick={() => apagarLancamento(item.id)}>
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-dark deposito">
                            <td>Depositado:</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="valor">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deposito)}</td>
                            <td></td>
                        </tr>
                        <tr className="bg-dark pago">
                            <td>Pago:</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="valor">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pago)}</td>
                            <td></td>
                        </tr>
                        <tr className="bg-dark pendente">
                            <td>Pendente:</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="valor">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pendente)}</td>
                            <td></td>
                        </tr>
                        <tr className="bg-dark saldo">
                            <td>Saldo:</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="valor">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldo)}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </Main>
    )
}

export default ViewLancamentos;