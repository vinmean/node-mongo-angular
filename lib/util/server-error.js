function AppError(title, message, code){
    this.title = title;
    this.message = message;
    this.code = code;
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

module.exports = AppError;