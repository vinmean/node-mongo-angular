module.exports = function Employee(config) {
    var _base = new (require('./base.js'))(config);
    
    var schemaDef = {
        email: { type: String, unique: true },
        firstName: String,
        lastName: String,
        twitter: String,
        facebook: String,
        linkedIn: String,
        skills: String,
        overview: String,
        photoSrc: String
    };
    
    var _model = _base.createModel('Employee', schemaDef);

    this.createEmployee = function createEmployee(employee, callback) {
        // Create new document from model
        //var emp = new _model({
        //    email: employee.email,
        //    firstName: employee.firstName || '',
        //    lastName: employee.lastName || '',
        //    twitter: employee.twitter || '',
        //    facebook: employee.facebook || '',
        //    linkedIn: employee.linkedIn || '',
        //    skills: employee.skills || '',
        //    overview: employee.overview || '',
        //    photoSrc: employee.photoSrc || ''
        //});
        
        //// svae the document
        //emp.save(function (err, empSaved) {
        //    var e = {};
        //    if (err.code == 11000) {
        //        e.code = 409;
        //        e.message = 'This email id is already in use';
        //    }
        //    else {
        //        e.code = 500;
        //        e.message = 'Unknown error while saving employee data';
        //    }
        //    // relay it through callback
        //    callback(e, empSaved);
        //});
        // OR use the method on the model directly
        //_model.create(_base.cloneWithoutId(employee),
        //    function (err, empSaved) {
        //    var e = {};
        //    if (err) {
        //        if (err.code == 11000) {
        //            e.code = 409;
        //            e.message = 'This email id is already in use';
        //        }
        //        else {
        //            e.code = 500;
        //            e.message = 'Unknown error while saving employee data';
        //        }
        //    } else {
        //        e = null;
        //    }

        //    // relay it through callback
        //    callback(e, empSaved);
        //});
        _base.createDocument(_model, employee, callback);
    };

    this.updateEmployee = function updateEmployee(employee, callback) {
        //var id = employee._id;
        //var emp = _base.cloneWithoutId(employee);

        //_model.update({ '_id': employee._id }, emp, function (err, empSaved) {
        //    var e = {};
        //    if (err) {
        //        e.code = 500;
        //        e.message = 'Unknown error while saving employee data';
        //    } else {
        //        e = null;
        //    }

        //    // relay it through callback
        //    callback(e, empSaved);
        //});
        _base.updateDocument(_model, employee, callback);
    };

    this.getFirst10Employees = function getFirst10Employees(callback){
        var query = _model.find();
        query.limit(10);
        query.exec(function (err, employees) {
            var e = {};
            if (err) {
                e.code = 500;
                e.message = 'Unknown error while retrieving employee data';
            } else {
                e = null;
            }
            
            // relay it through callback
            callback(e, employees);
        });
    }
    this.close = _base.closeAllConnections;
};

