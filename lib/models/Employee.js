module.exports = function Employee(config) {
    var _base = new (require('./base.js'))(config);
    
    var _model = _base.createModel('Employee', {
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

    this.createEmployee = function createEmployee(employee, callback) {
        _base.createDocument(_model, employee, callback);
    };

    this.updateEmployee = function updateEmployee(employee, callback) {
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
    
    this.getFirst10EmployeesBySkill = function getFirst10EmployeesByLastName(search, callback) {
        var query = _model.find();
        if (search && (search !== '')) {
            query = _model.find({ skills: new RegExp(search, "i") });
        }
        else {
            return callback(null, null);
        }
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
    
    this.getFirst10EmployeesByLastName = function getFirst10EmployeesByLastName(search, callback) {
        var query = _model.find();
        if (search && (search !== '')) {
            query = _model.find({ lastName: new RegExp(search, "i") });
        }
        else {
            return callback(null, null);
        }
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
    
    this.getFirst10EmployeesByFirstName = function getFirst10EmployeesByFirstName(search, callback) {
        var query = _model.find();
        if (search && (search !== '')) {
            query = _model.find({ firstName: new RegExp(search, "i") });
        }
        else {
            return callback(null, null);
        }
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

    this.getEmployeeById = function (id, callback){
        _base.getDocumentById(_model, id, callback);
    }
};

