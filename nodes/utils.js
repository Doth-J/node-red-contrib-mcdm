"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = {
    sum: (arr, initial = 0) => arr.reduce((x, sum) => x + sum, initial),
    sumColumns: (arr) => arr.reduce((col, sum) => col.map((x, index) => x + sum[index])),
    sumRows: (arr) => arr.map((row) => utils.sum(row)),
    square: (arr) => arr.map(x => x * x),
    square2D: (arr) => arr.map(x => utils.square(x)),
    squareRoot: (arr) => arr.map(x => Math.sqrt(x)),
    subtractArrays: (arr, subtractor) => arr.map((x) => x.map((val, index) => val - subtractor[index])),
    divideArrays: (arr, divisor) => arr.map((x) => x.map((val, index) => val / divisor[index])),
    multiplyArrays: (arr, multiplier) => arr.map((x) => x.map((val, index) => val * multiplier[index])),
    normalize: (arr) => arr.map(x => (x - Math.min(...arr)) / (Math.max(...arr) - Math.min(...arr)))
};
exports.default = utils;
