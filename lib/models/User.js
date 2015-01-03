var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    profileId: String,
    provider: String,
    accessToken: String
});

userSchema.methods.findUserByProfileId = function (done) {
    return this.model('User').findOne({ 'profileId': this.profileId }, done);
};

module.exports = function User(config) {
    var connection = mongoose.createConnection(config.mongodb.connectionString, config.mongoose.opts);
    return connection.model('User', userSchema);
};