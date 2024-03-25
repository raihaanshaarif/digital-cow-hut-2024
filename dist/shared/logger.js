"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorlogger = exports.logger = void 0;
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, label, printf } = winston_1.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${date.toString()} ${hour}:${minute}:${second} [${label}] ${level}: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(label({ label: 'right meow!' }), timestamp(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'sueccess', '%DATE%-success.log'),
            datePattern: 'YYYY-DD-MM-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});
exports.logger = logger;
const errorlogger = (0, winston_1.createLogger)({
    level: 'error',
    format: combine(label({ label: 'right meow!' }), timestamp(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'errors', '%DATE%-error.log'),
            datePattern: 'YYYY-DD-MM-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});
exports.errorlogger = errorlogger;
