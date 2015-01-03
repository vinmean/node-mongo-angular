var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    twitter: String,
    facebook: String,
    linkedIn: String,
    skills: String,
    overview: String,
    photoSrc: String
});

module.exports = function Employee(config){
    var connection = mongoose.createConnection(config.mongodb.connectionString, config.mongoose.opts);
    return connection.model('Employee', employeeSchema);
}