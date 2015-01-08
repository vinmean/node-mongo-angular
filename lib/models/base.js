module.exports = function Base(config) {
    var connection = config.mongodb.connect.connection;
    
    this.createModel = function (name, schema) {
        return connection.model(name, new config.mongodb.mongoose.Schema(schema));
    }
    
    this.cloneWithoutId = function (input) {
        var output = {};
        
        for (var key in input) {
            output[key] = input[key];
        }
        if (output['_id']) {
            delete output._id;
        }
        return output;
    }
    
    this.createDocument = function (model, data, callback) {
        model.create(this.cloneWithoutId(data),
            function (err, dataSaved) {
            var e = {};
            if (err) {
                if (err.code == 11000) {
                    e.code = 409;
                    e.message = 'There is a duplicate key violation';
                }
                else {
                    e.code = 500;
                    e.message = 'Unknown error while saving data';
                }
            } else {
                e = null;
            }
            
            // relay it through callback
            callback(e, dataSaved);
        });
    };
    
    this.updateDocument = function (model, data, callback) {
        var id = data._id;
        var clone = this.cloneWithoutId(data);
        
        model.update({ '_id': id }, clone, function (err, dataSaved) {
            var e = {};
            if (err) {
                e.code = 500;
                e.message = 'Unknown error while saving data';
            } else {
                e = null;
            }
            
            // relay it through callback
            callback(e, dataSaved);
        });
    };
    
    this.getDocumentById = function (model, id, callback) {
        model.findById(id, function (err, retrievedDoc) {
            if (err || !retrievedDoc) {
                return callback({
                    code: 500, 
                    message: 'Unknown error while retrieving data'
                }, null);
            }
            callback(null, retrievedDoc);
        })
    }
    
    this.getCount = function (model, callback) {
        model.count(callback);
    }
}