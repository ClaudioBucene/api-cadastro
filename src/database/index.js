const mongoose = require('mongoose');

//Node se conecta com a BD MongoDB "noderest" pelo mongoose
mongoose.connect('mongodb://localhost/noderest');
mongoose.Promise = global.Promise;

module.exports = mongoose;


