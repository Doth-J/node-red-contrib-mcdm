"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const utils_1 = __importDefault(require("./utils"));
module.exports = function (RED) {
    function SAWNode(config) {
        RED.nodes.createNode(this, config);
        this.on('input', (msg, send, done) => {
            const { decisionMatrix, weights } = msg.payload;
            if (!Array.isArray(weights)) {
                return this.error("Dimension Error: msg.payload.weights must be an array!");
            }
            if (utils_1.default.sum(weights) != 1) {
                return this.error("Weight Error: msg.payload.weights must sum to 1!");
            }
            if (!Array.isArray(decisionMatrix)) {
                return this.error("Dimension Error: msg.payload.decisionMatrix must be an array!");
            }
            decisionMatrix.forEach((_, i) => {
                if (!Array.isArray(_))
                    return this.error(`Dimension Error: Decision matrix must be a 2d array, check alternative no.${i + 1}`);
                if (_.length != weights.length)
                    return this.error(`Dimension Mismatch: Decision matrix must be same length as weight, check alternative no.${i + 1}`);
            });
            if (config.performance)
                performance.clearMarks(), performance.clearMeasures(), performance.mark("start");
            const squaredColumnSums = utils_1.default.squareRoot(utils_1.default.sumColumns(utils_1.default.square2D(decisionMatrix))), normalizedMatrix = utils_1.default.divideArrays(decisionMatrix, squaredColumnSums);
            if (config.performance)
                performance.mark("step 1");
            const weightedMatrix = normalizedMatrix.map((row, i) => row.map(val => val * weights[i]));
            if (config.performance)
                performance.mark("step 2");
            const scores = utils_1.default.sumRows(weightedMatrix), bestAlternativeIndex = scores.indexOf((Math.max(...scores)));
            if (config.performance)
                performance.mark("step 3");
            msg.payload = { decisionMatrix, weights, scores, bestAlternativeIndex };
            if (config.performance) {
                performance.measure("Total", { start: "start", detail: "Total time in (ms)", end: "step 3" });
                performance.measure("Step 1", { start: "start", detail: "Normalizing the Decision Matrix", end: "step 1" });
                performance.measure("Step 2", { start: "step 1", detail: "Weighted Normalized Decision Matrix", end: "step 2" });
                performance.measure("Step 3", { start: "step 2", detail: "Best Alternative Calculation", end: "step 3" });
                Object.assign(msg.payload, { performance: performance.getEntriesByType("measure"), inputSize: decisionMatrix.length * decisionMatrix[0].length });
            }
            send(msg);
            if (done)
                done();
        });
    }
    RED.nodes.registerType('saw', SAWNode);
};
