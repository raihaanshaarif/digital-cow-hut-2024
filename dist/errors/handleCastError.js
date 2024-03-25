"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const error = [
        {
            path: err.path,
            message: 'Invalid Id',
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: 'Cast Error',
        errorMessages: error,
    };
};
exports.default = handleCastError;
