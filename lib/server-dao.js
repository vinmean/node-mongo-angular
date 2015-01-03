module.exports = function Dao(credentials){
    var mongoose = require('mongoose');

    var async = require('async');

    var opts = {
        server: {
            socketOptions: { keepAlive: 1 }
        }
    };

    mongoose.connect(credentials.mongodb.connectionString, opts);
    
    // Save a model
    this.save = function (model, done){
        model.save(done);
    }
}