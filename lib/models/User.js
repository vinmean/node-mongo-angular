module.exports = function User(config) {
    var _base = new (require('./base.js'))(config);
    
    var _model = _base.createModel('User', {
        email: { type: String, unique: true },
        firstName: String,
        lastName: String,
        profileId: String,
        provider: String,
        accessToken: String
    });

    this.createUser = function(user, callback) {
        _base.createDocument(_model, user, callback);
    };

    this.getUserById = function (id, callback) {
        _base.getDocumentById(_model, id, callback);
    };

    this.getUserByProfileId = function (profileId, callback) {
        _model.findOne({ 'profileId': profileId }, callback);
    };

    this.totalUserCount = function (callback) {
        _base.getCount(_model, callback);
    };

};
