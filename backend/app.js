const express = require('express'); //gerencia requesições, rotas e urls...
const { Op } = require('sequelize') //facilita o gerenciamento de um banco de dados
const cors = require('cors'); // responsvel por fazer a comunicação com o frontend
const app = express(); // app ficou responsavel por deter o express

const Lancamentos = require('./models/Lancamentos')

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    next();
}); // configurando a API para receber e passar informações

app.get('/listar/:mes/:ano', async (req, res) => {
    let mes = new Number(req.params.mes);
    let ano = new Number(req.params.ano);

    const date = new Date(ano + "-" + mes);
    let primeiroDia = new Date(date.getFullYear(), date.getMonth(), 1);
    let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    const lancamentos = await Lancamentos.findAll({
        order: [['dataPagamento', 'ASC']],
        where: {
            "dataPagamento": {
                [Op.between]: [primeiroDia, ultimoDia]
            }
        }
    });

    const valorRecebido = await Lancamentos.sum('valor', {
        where: {
            tipo: '2',
            "dataPagamento": {
                [Op.between]: [primeiroDia, ultimoDia]
            }
        }
    });

    const valorPago = await Lancamentos.sum('valor', {
        where: {
            tipo: '1',
            situacao: '1',
            "dataPagamento": {
                [Op.between]: [primeiroDia, ultimoDia]
            }
        }
    });

    const valorPendente = await Lancamentos.sum('valor', {
        where: {
            tipo: '1',
            situacao: '2',
            "dataPagamento": {
                [Op.between]: [primeiroDia, ultimoDia]
            }
        }
    });

    const saldo = new Number(valorRecebido) - new Number(valorPago);

    return res.json({
        erro: false,
        lancamentos,
        valorRecebido,
        valorPago,
        valorPendente,
        saldo
    })
});

app.get('/visualizar/:id', async (req, res) => {
    await Lancamentos.findByPk(req.params.id).then(lancamento => {
        return res.json({
            erro: false,
            lancamento
        })
    }).catch(function () {
        return res.status(400).json({
            erro: true,
            msg: "Erro: Lançamento não encontrado!"
        });
    });
});

app.post('/cadastrar', async (req, res) => {
    await Lancamentos.create(req.body).then(function () {
        return res.json({
            erro: false,
            msg: "Lançamento cadastrado com Sucesso!"
        })
    }).catch(function () {
        return res.status(400).json({
            erro: true,
            msg: "Erro: Lançamento não cadastrado com Sucesso!"
        });
    });
});

app.put('/editar', async (req, res) => {
    let dados = req.body;
    await Lancamentos.update(dados, { where: { id: dados.id } }).then(function () {
        return res.json({
            erro: false,
            msg: "Lançamento editado com sucesso!"
        });
    }).catch(function () {
        return res.status(400).json({
            erro: true,
            msg: "Erro: Falha na edição do lançamento!"
        })
    });
});

app.delete('/apagar/:id', async (req, res) => {
    await Lancamentos.destroy({where: {id: req.params.id}}).then(function() {
        return res.json({
            erro: false,
            msg: "Lançamento deletado com sucesso!"
        });
    }).catch(function () {
        return res.status(400).json({
            erro: true,
            msg: "Erro: Lançamento não foi deletado!!"
        });
    })
});

app.listen(8080, function () {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
})