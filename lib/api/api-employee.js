module.exports = function EmployeeApi(config, app) {
    var models = require('../models')
    , Employee = new models.Employee(config);

    var api = {
        getEmployeesApi: function () {
            app.get('/api/employees', config.auth.ensureApiAuthenticated, function (req, res) {
                Employee.getFirst10Employees(function (err, employees) {
                    if (err) {
                        console.log(err);
                        req.session.error = {
                            title: "App Error", 
                            message: err.message , 
                            code: err.code
                        };
                        return res.status(req.session.error.code).json(req.session.error);
                    } else {
                        return res.status(200).json(employees);
                    }
                });
            });
        },
        getEmployeeApi: function () {
            app.get('/api/employees/:id', config.auth.ensureApiAuthenticated, function (req, res) {
                Employee.getEmployeeById(req.params.id, function (err, employee) {
                    if (err) {
                        console.log(err);
                        req.session.error = {
                            title: "App Error", 
                            message: err.message , 
                            code: err.code
                        };
                        return res.status(req.session.error.code).json(req.session.error);
                    } else {
                        return res.status(200).json(employee);
                    }
                });
            });
        },
        createEmployeeApi: function () {
            app.post('/api/employees', config.auth.ensureApiAuthenticated, function (req, res) {
                var employee = req.body;
                Employee.createEmployee(employee, function (err, newEmp) {
                    if (err) {
                        console.log(err);
                        req.session.error = {
                            title: "App Error", 
                            message: err.message , 
                            code: err.code
                        };
                        return res.status(req.session.error.code).json(req.session.error);
                    } else {
                        res.location('/api/employees/' + newEmp._id);
                        return res.sendStatus(201);
                    }
                });
            });
        },
        
        saveEmployeeApi: function () {
            app.post('/api/employees/:id', config.auth.ensureApiAuthenticated, function (req, res) {
                var id = req.params.id;
                var employee = req.body;
                Employee.updateEmployee(employee, function (err, empSaved) {
                    if (err) {
                        console.log(err);
                        req.session.error = {
                            title: "App Error", 
                            message: err.message , 
                            code: err.code
                        };
                        return res.status(req.session.error.code).json(req.session.error);
                    } else {
                        res.location('/api/employees/' + empSaved._id);
                        return res.sendStatus(201);
                    }
                });
            });
        }
    };

    function init() {
        config.api.registerRoutes(api);
    }
    
    init();
}