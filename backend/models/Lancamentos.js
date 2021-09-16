const Sequelize = require('sequelize')
const db = require('./db')

const Lancamentos = db.define('lancamentos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    valor: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },//Tipo 1: Pagamento / Tipo 2: Recebido
    tipo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },//Tipo 1: Pago / Tipo 2: Pendente / tipo 3: Recebido
    situacao: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    dataPagamento: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

//Lancamentos.sync(); //verifica se existe a table, se não existir irá criar, já se existir não irá fazer nada

//Lancamentos.sync({ alter: true }); // verifica as alterações na tabela e realiza as mesmas

module.exports = Lancamentos;