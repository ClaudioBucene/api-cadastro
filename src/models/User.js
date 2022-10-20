const mongoose = require('../database');
const bcrypt = require('bcryptjs');

//it's like os campos que temos na base de dados na tabela de users
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        select: false, //para qdo for buscar a info do user, essa dado nao constar
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

/*pre funcao do mongoose para que aconteca algo antes de salvar o user
Gera um hash da senha 10 vezes. O this refere-se ao user sendo criado.
*/
UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10); 
    this.password = hash;
    
    next();
})

//Definindo o model (nomeDoModel, nomeDoSchema)
const User = mongoose.model('User', UserSchema);

module.exports = User;