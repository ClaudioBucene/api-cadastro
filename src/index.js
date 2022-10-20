const express = require('express');
const bodyParser = require('body-parser');

//Cria o core da Aplicacao
const app = express(); 

//Indica que usa o bodyParser
app.use(bodyParser.json()); // requisicoes json
app.use(bodyParser.urlencoded({extended: false})); //parametros_url

//Repassar a app para o authController 
require('./controllers/authController')(app);

app.listen(3000); //Ouvir a app na porta 3000