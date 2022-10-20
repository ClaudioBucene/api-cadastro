const express = require('express');

//Para fazer login e cadastro de user
const User = require('../models/User');

//Para definir rotas so para user
const router = express.Router();

//Definindo rota de cadastro
router.post('/register', async(req, res) =>{

    //Usamos o e-mail por ser unico
    const { email } =req.body;

    try{

    if(await User.findOne({ email }))
       return res.status(400).send({error: 'User already exists'});

        /** Pegar todos parametros enviados pelo user 
         * e criar um novo user no Model do mongoose
         * Await espera algo ser executado
         * */
        const user = await User.create(req.body);

        //O password e apagado qdo o user e criado
        user.password = undefined;

        return res.send({user});
    } catch(err){
        return res.status(400).send({error: 'Registration failed'});
    }


});

// Recebe o app como parametro e retorna 
module.exports = app => app.use('/auth', router);

// Assim sendo para acessar a rota de cadastro
//Type /auth/register