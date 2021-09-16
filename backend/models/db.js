// conexão com o banco
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('gerenciador_financeiro', 'rafael', '123456789', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(function () {
    console.log("Conexão com o Banco de Dados Realizada com Sucesso!")
}).catch(function (err) {
    console.log("Erro: Falha na Conexão com o Banco de Dados!")
});

module.exports = sequelize;