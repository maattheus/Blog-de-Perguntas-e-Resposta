const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//Database

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

//Estou dizendo para o express usar o ejs como view engine = html
app.set('view engine', 'ejs');
app.use(express.static('public'));


//Body Parser 
app.use(bodyParser.urlencoded({ extended: false })); //decodifica os dados enviados pelo formularios
app.use(bodyParser.json());


//Rotas
app.get("/", function (req, res) {
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC']    //ordenando do maior id pro menor  (ids mais recentes)
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", function (req, res) {
    res.render("perguntar");
});
app.post("/salvarPergunta", function (req, res) {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {   //pergunta foi achada

            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [['id', 'DESC']]

            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        } else
            res.redirect("/");
    })

});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });

});

app.listen(8080, () => {
    console.log("App Rodando!");
});