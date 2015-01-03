angular.module('EmpApp')
  .factory('Employee', ['$resource', function ($resource) {
      return $resource('/api/employees/:_id');
  }]);
/*
 { 
    'get':    {method:'GET'},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'remove': {method:'DELETE'},
    'delete': {method:'DELETE'} 
  };
 */