const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const connection = require("./database");

const Pergunta = connection.define('Pergunta', {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false,       
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false}).then(() =>{}); //se a tabela ja tiver sido criado isso faz q nao crie outra 

module.exports = Pergunta;
