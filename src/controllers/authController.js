const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');

//Para fazer login e cadastro de user
const User = require('../models/User');

//Para definir rotas so para user
const router = express.Router();

function generateToken(params = {}){
        //Gerar token com JWt
    //Param1: o id diferencia um user do outro
    //Param2: hash unico gerado para a app (config/auth.json)
    //Param3: O token expira em um dia (86400 segundos) 

   return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });

}

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

        //Retornar o user o token, qdo a autenticacao tiver sido feita com sucesso
        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });
        
    } catch(err){
        return res.status(400).send({error: 'Registration failed'});
    }


});

//Rota de autenticacao
router.post('/authenticate', async(req, res) =>{
    //Qdo o user faz login manda o email e o password
    const {email, password} = req.body;

    //Vou procurar no meu backend um user com esse email, e trago o seu password
    const user = await User.findOne({email}).select('+password');

    if(!user)
    return res.status(400).send({ error: 'User not found'});

    //Verifico se o password introduzido corresponde ao que fui buscar no backend
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: 'Invalid password'});

        //Para nao me retornar o password ao fazer a autenticacao
    user.password = undefined;
    
        res.send({
         user,
         token: generateToken({ id: user.id })});
});





// Recebe o app como parametro e retorna 
module.exports = app => app.use('/auth', router);

// Assim sendo para acessar a rota de cadastro
//Type /auth/register