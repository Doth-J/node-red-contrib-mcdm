import * as NodeRED from "node-red";
import utils from "./utils";

interface PROMETHEENodeConfig extends NodeRED.NodeDef{
  performance:boolean,
  pfunction:string,
  p: number,
  q: number,
  s: number
}

export = function(RED:NodeRED.NodeAPI){

    function PROMETHEENode(this:NodeRED.Node, config:PROMETHEENodeConfig){
      RED.nodes.createNode(this,config);
      const computePairwiseComparisonMatrix = (alternatives:number[],preferenceFunction:string,...parameters:number[]) => {
        const matrix:number[][] = [];
        for(let i=0; i<alternatives.length; i++){
            const row:number[] = [];
            switch(preferenceFunction){
                case "usualCriterion":{
                    for(let j=0; j<alternatives.length; j++){
                        row.push(alternatives[i] >= alternatives[j] ? 0 : 1);
                    }
                    break;
                }
                case "levelCriterion":{
                    for(let j=0; j<alternatives.length; j++){
                        row.push(Math.abs(alternatives[i] - alternatives[j]) <= parameters[0] ? 0 : (alternatives[i] > alternatives[j] ? 1 : 0));
                    }
                    break;
                }
                case "quasiCriterion":{
                    for(let j=0; j<alternatives.length; j++){
                        row.push(Math.abs(alternatives[i] - alternatives[j]) <= parameters[1] ? (alternatives[i] > alternatives[j] ? 1 : 0) : 0);
                    }
                    break;
                }
                case "gaussianCriterion":{
                    for(let j=0; j<alternatives.length; j++){
                        row.push(alternatives[i] <= alternatives[j] ? 0 : -Math.exp(-Math.pow(alternatives[i] - alternatives[j],2) / (2 * Math.pow(parameters[2],2))));
                    }
                    break;
                }
                case "linearCriterion":{
                    for(let j=0; j<alternatives.length; j++){
                        if(alternatives[i] - alternatives[j] <= parameters[0]) {
                            row.push(0);
                        }else if(alternatives[i] - alternatives[j] >= parameters[2]){
                            row.push(1);
                        }else{
                            row.push((alternatives[i] - alternatives[j] - parameters[0]) / (parameters[2] - parameters[0]))
                        }
                    }
                    break;
                }
            }
            matrix.push(row);
        }
        return matrix
      }
      this.on('input',(msg:any,send,done)=>{
        const {decisionMatrix,weights} = msg.payload,
              preferenceFunction = config.pfunction, 
              p = config.p ?? 0, 
              q = config.q ?? 0, 
              s = config.s ?? 0;
        
        if(!Array.isArray(weights)){
          return this.error("Dimension Error: msg.payload.weights must be an array!")
        }
        
        if(utils.sum(weights)!=1){
          return this.error("Weight Error: msg.payload.weights must sum to 1!")
        }
                  
        if(!Array.isArray(decisionMatrix)){
          return this.error("Dimension Error: msg.payload.decisionMatrix must be an array!")
        }

        decisionMatrix.forEach((_,i)=>{
          if(!Array.isArray(_)) return this.error(`Dimension Error: Decision matrix must be a 2d array, check alternative no.${i+1}`)
          if(_.length != weights.length) return this.error(`Dimension Mismatch: Decision matrix must be same length as weight, check alternative no.${i+1}`)
        })

        if(config.performance) performance.clearMarks(), performance.clearMeasures(), performance.mark("start");
        
        const squaredMatrix = utils.square2D(decisionMatrix),
              squaredColumnSums = utils.squareRoot(utils.sumColumns(squaredMatrix)),
              normalizeddecisionMatrix = utils.divideArrays(decisionMatrix,squaredColumnSums),
              weightedMatrix = utils.multiplyArrays(normalizeddecisionMatrix,weights);
        if(config.performance) performance.mark("step 1");
        
        const pairwiseComparisonMatrixes:number[][][] = []
        for(let i=0; i<weightedMatrix.length; i++){
            pairwiseComparisonMatrixes.push(computePairwiseComparisonMatrix(weightedMatrix.map(alternative => alternative[i]),preferenceFunction,p,q,s))
        }
        if(config.performance) performance.mark("step 2");
       
        const numAlternatives = pairwiseComparisonMatrixes.length,
              positiveFlows = new Array(numAlternatives).fill(0),
              negativeFlows = new Array(numAlternatives).fill(0);
        pairwiseComparisonMatrixes.forEach((matrix, index) => {
            for(let i = 0; i < numAlternatives; i++) {
                for(let j = 0; j < numAlternatives; j++) {
                    positiveFlows[i] += weights[index] * matrix[i][j] / (numAlternatives);
                    negativeFlows[i] += weights[index] * matrix[j][i] / (numAlternatives);
                }
            }
        });
        if(config.performance) performance.mark("step 3");
        
        const netFlows = positiveFlows.map((positiveFlow, index) => positiveFlow - negativeFlows[index]),
              ranks = netFlows.map((value, index) => ({ alternative: index + 1, netFlow: value })).sort((a, b) => b.netFlow - a.netFlow);
        if(config.performance) performance.mark("step 4");
        
        msg.payload = {decisionMatrix,weights,ranks}

        if(config.performance){
          performance.measure("Total",{start:"start",detail:"Total time in (ms)",end:"step 4"})
          performance.measure("Step 1",{start:"start",detail:"Weighted Normalized Decision Matrix",end:"step 1"})
          performance.measure("Step 2",{start:"step 1",detail:"Calculating Pairwise Comparison Matrices",end:"step 2"})
          performance.measure("Step 3",{start:"step 2",detail:"Determining Positive and Negative Flows",end:"step 3"})
          performance.measure("Step 4",{start:"step 3",detail:"Computing NetFlows and Ranks",end:"step 4"})
          Object.assign(msg.payload,{performance:performance.getEntriesByType("measure"),inputSize:decisionMatrix.length*decisionMatrix[0].length})
        }
        
        send(msg);
        if(done) done();
      });
    }

    RED.nodes.registerType('promethee',PROMETHEENode);
      
}