module.exports = function EmployeeApi(config, app) {
    var models = require('../models')
    , Employee = new models.Employee(config);
    var AppError = require('../util/server-error.js');
    
    var api = {
        getEmployeesApi: function () {
            app.get('/api/employees', config.auth.ensureApiAuthenticated, function (req, res) {
                console.log(req.query);
                var searchText = (req.query.searchText)? req.query.searchText: '';
                var searchType = (req.query.searchType)? req.query.searchType: '1';
                console.log('searchText = ' + searchText);
                if (searchText !== '') {
                    switch (searchType) {
                        case '2':
                            console.log("search by skills");
                            Employee.getFirst10EmployeesBySkill(searchText, function (err, employees) {
                                if (err) {
                                    console.log(err);
                                    req.session.error = new AppError(
                                        "App Error", 
                                        err.message , 
                                        err.code
                                    );
                                    return res.status(req.session.error.code).json(req.session.error);
                                } else {
                                    return res.status(200).json(employees);
                                }
                            });
                            break;
                        default:
                            console.log("search by last name");
                            Employee.getFirst10EmployeesByLastName(searchText, function (err, employees) {
                                if (err) {
                                    console.log(err);
                                    req.session.error = new AppError(
                                        "App Error", 
                                         err.message , 
                                         err.code
                                    );
                                    return res.status(req.session.error.code).json(req.session.error);
                                } else {
                                    return res.status(200).json(employees);
                                }
                            });
                            break;
                    }
                }
                else {
                    Employee.getFirst10Employees(function (err, employees) {
                        if (err) {
                            console.log(err);
                            req.session.error = new AppError(
                                "App Error", 
                                 err.message , 
                                 err.code
                            );
                            return res.status(req.session.error.code).json(req.session.error);
                        } else {
                            return res.status(200).json(employees);
                        }
                    });
                }


            });
        },
        getEmployeeApi: function () {
            app.get('/api/employees/:id', config.auth.ensureApiAuthenticated, function (req, res) {
                Employee.getEmployeeById(req.params.id, function (err, employee) {
                    if (err) {
                        console.log(err);
                        req.session.error = new AppError(
                            "App Error", 
                             err.message , 
                             err.code
                        );
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
                if (employee._id) {
                    //Update
                    Employee.updateEmployee(employee, function (err, newEmp) {
                        if (err) {
                            console.log(err);
                            req.session.error = new AppError(
                                 "App Error", 
                                 err.message , 
                                 err.code
                            );
                            return res.status(req.session.error.code).json(req.session.error);
                        } else {
                            res.location('/api/employees/' + newEmp._id);
                            return res.sendStatus(201);
                        }
                    });
                }
                else {
                    //Create
                    Employee.createEmployee(employee, function (err, newEmp) {
                        if (err) {
                            console.log(err);
                            req.session.error = new AppError(
                                 "App Error", 
                                 err.message , 
                                 err.code
                            );
                            return res.status(req.session.error.code).json(req.session.error);
                        } else {
                            res.location('/api/employees/' + newEmp._id);
                            return res.sendStatus(201);
                        }
                    });
                }
            });
        }
    };
    
    function init() {
        config.api.registerRoutes(api);
    }
    
    init();
}