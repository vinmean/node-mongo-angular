var lodash = require('lodash');
var validCodes = [12345678922, 13345678922, 12445678922, 14545678922, 12345123422, 12322134522];
var allowedUserCount = 10;

exports.isValidSignUpCode = function (signUpCode) {

    if (lodash.contains(validCodes, signUpCode)) {
        return true;
    }

    return false;
};

exports.canUserSignUp = function (userCount){
    if (userCount < allowedUserCount) {
        return true;
    }
    return false;
}