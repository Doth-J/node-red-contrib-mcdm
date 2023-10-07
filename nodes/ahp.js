"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const utils_1 = __importDefault(require("./utils"));
module.exports = function (RED) {
    function AHPNode(config) {
        RED.nodes.createNode(this, config);
        this.on('input', (msg, send, done) => {
            const pairwiseComparisonMatrix = msg.payload;
            if (!Array.isArray(pairwiseComparisonMatrix)) {
                return this.error("msg.payload must be an array!");
            }
            pairwiseComparisonMatrix.forEach((_, i) => {
                if (_.length != pairwiseComparisonMatrix.length)
                    return this.error(`Dimension Mismatch: Matrix must be square array!`);
            });
            if (config.performance)
                performance.clearMarks(), performance.clearMeasures(), performance.mark("start");
            const columnsSums = utils_1.default.sumColumns(pairwiseComparisonMatrix);
            if (config.performance)
                performance.mark("step 1");
            const normalized = utils_1.default.divideArrays(pairwiseComparisonMatrix, columnsSums);
            if (config.performance)
                performance.mark("step 2");
            const priorities = normalized.map((row) => { return utils_1.default.sum(row) / pairwiseComparisonMatrix.length; });
            if (config.performance)
                performance.mark("step 3");
            msg.payload = { pairwiseComparisonMatrix, priorities };
            if (config.performance) {
                performance.measure("Total", { start: "start", detail: "Total time in (ms)", end: "step 3" });
                performance.measure("Step 1", { start: "start", detail: "Pairwise Comparison Matrix", end: "step 1" });
                performance.measure("Step 2", { start: "step 1", detail: "Normalization", end: "step 2" });
                performance.measure("Step 3", { start: "step 2", detail: "Eigenvalues and Eigenvectors", end: "step 3" });
                Object.assign(msg.payload, { performance: performance.getEntriesByType("measure"), inputSize: pairwiseComparisonMatrix.length * pairwiseComparisonMatrix[0].length });
            }
            send(msg);
            if (done)
                done();
        });
    }
    RED.nodes.registerType('ahp', AHPNode);
};
