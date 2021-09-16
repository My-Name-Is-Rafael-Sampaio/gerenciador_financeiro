import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Main from '../template/Main';
import api from '../../config/configApi'

const EditLancamento = (props) => {

    const [id] = useState(props.match.params.id);
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('');
    const [situacao, setSituacao] = useState('');
    const [dataPagamento, setDataPagamento] = useState('');

    const [valorLancTarget, setValorLancTarget] = useState('');

    const [status, setStatus] = useState({
        type: '',
        msg: ''
    });

    const converterParaReal = async (valorLancamentoInput) => {
        let valorLancConvert = valorLancamentoInput.toString().replace(/\D/g, "");
        
        valorLancConvert = valorLancConvert.replace(/(\d)(\d{2})$/, "$1,$2");
        valorLancConvert = valorLancConvert.replace(/(?=(\d{3})+(\D))\B/g, ".");
        
        setValorLancTarget(valorLancConvert);

        let valorSalvar = await valorLancConvert.replace(".", "");
        valorSalvar = await valorSalvar.replace(",", ".");
        setValor(valorSalvar);
    }

    const editLancamento = async e => {
        e.preventDefault();

        const headers = {
            'Content-Type': 'application/json'
        }
        await api.put("/editar", { id, nome, valor, tipo, situacao, dataPagamento }, { headers }).then((response) => {
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
                    msg: "Erro: Falha na edição do lancamento, perca de conexão!"
                });
            }
        })
    }

    useEffect(() => {
        const getLancamento = async () => {
            await api.get(`/visualizar/${id}`).then((response) => {
                setNome(response.data.lancamento.nome);
                setValor(response.data.lancamento.valor);
                converterParaReal(response.data.lancamento.valor);
                setTipo(response.data.lancamento.tipo);
                setSituacao(response.data.lancamento.situacao);
                setDataPagamento(moment.utc(response.data.lancamento.dataPagamento).format('YYYY-MM-DD'));
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        msg: err.response.data.msg
                    })
                } else {
                    setStatus({
                        type: 'error',
                        msg: "Erro: Falha de conexão com o servidor!"
                    })
                }
            })
        }
        getLancamento();
    }, [id])

    return (
        <Main icon="file-text" title="Editar um lançamento" subtitle="Tela de edição de lançamento.">

            <div className="alert">
                {status.type === 'error' ? <span className="spanDanger">{status.msg}</span> : ""}
                {status.type === 'success' ? <span className="spanSuccess">{status.msg}</span> : ""}
            </div>

            <div className="conteudoTitulo">
                <h1>Formulário de Edição</h1>
                <Link to="/finanças">
                    <button className="btn btn-outline-secondary">
                        <i className="fa fa-arrow-left"></i>
                        Voltar
                    </button>
                </Link>
            </div>

            <form onSubmit={editLancamento}>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control" name="nome" placeholder="Conta de Água" value={nome} onChange={e => setNome(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Valor</label>
                            <input type="text" className="form-control" name="valor" placeholder="100,00" value={valorLancTarget} onChange={e => converterParaReal(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Tipo</label>
                            <select className="form-control" name="tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="1">Pagamento</option>
                                <option value="2">Recebido</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Situação</label>
                            <select className="form-control" name="situacao" value={situacao} onChange={e => setSituacao(e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="1">Pago</option>
                                <option value="2">Pendente</option>
                                <option value="3">Recebido</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Data</label>
                        <input type="date" className="form-control" name="dataPagamento" value={dataPagamento} onChange={e => setDataPagamento(e.target.value)} />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button type="submit" className="btn btn-outline-primary">
                            <i className="fa fa-floppy-o"></i>
                            Salvar
                        </button>
                    </div>
                </div>
            </form>
        </Main>
    )
}

export default EditLancamento;