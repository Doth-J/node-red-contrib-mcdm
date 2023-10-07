import * as NodeRED from "node-red";
import utils from "./utils";

interface VIKORNodeConfig extends NodeRED.NodeDef{
  v:number
  performance:boolean
}

export = function(RED:NodeRED.NodeAPI){

  function VIKORNode(this:NodeRED.Node, config:VIKORNodeConfig){
      RED.nodes.createNode(this,config);
      this.on('input',(msg:any,send,done)=>{
        const {decisionMatrix,weights} = msg.payload,v = config.v;

        if(!Array.isArray(weights)){
          throw Error("Dimension Error: msg.payload.weights must be an array!")
        }

        if(utils.sum(weights)!=1){
          return this.error("Weight Error: msg.payload.weights must sum to 1!")
        }
                  
        if(!Array.isArray(decisionMatrix)){
          throw Error("Dimension Error: msg.payload.decisionMatrix must be an array!")
        }
  
        decisionMatrix.forEach((_,i)=>{
          if(!Array.isArray(_)) throw Error(`Dimension Error: Decision matrix must be a 2d array, check alternative no.${i+1}`)
          if(_.length != weights.length) throw Error(`Dimension Mismatch: Decision matrix must be same length as weight, check alternative no.${i+1}`)
        })
    
        if(config.performance) performance.clearMarks(), performance.clearMeasures(), performance.mark("start");
    
        const squaredColumnSums = utils.squareRoot(utils.sumColumns( utils.square2D(decisionMatrix))),
              normalizedMatrix = utils.divideArrays(decisionMatrix,squaredColumnSums),
              weightedNormalizedMatrix = normalizedMatrix.map((row, i) => row.map(val => val * weights[i]));
        if(config.performance) performance.mark("step 1");
    
        const PIS = weightedNormalizedMatrix[0].slice();  
              weightedNormalizedMatrix.forEach(alternative => {
                  alternative.forEach((value, criterionIdx) => {
                      PIS[criterionIdx] = Math.max(PIS[criterionIdx], value);
                  });
              });
        if(config.performance) performance.mark("step 2");

        const S = weightedNormalizedMatrix.map(alt => PIS.reduce((sum, pisVal, idx) => sum + pisVal - alt[idx], 0)),
              R = weightedNormalizedMatrix.map(alt => PIS.reduce((max, pisVal, idx) => Math.max(max, pisVal - alt[idx]), 0));      
        if(config.performance) performance.mark("step 3");
        
        const S_min = Math.min(...S),
              S_max = Math.max(...S),
              R_min = Math.min(...R), 
              R_max = Math.max(...R),
              Q = S.map((S_val, i) => v * (S_val - S_min) / (S_max - S_min) + (1 - v) * (R[i] - R_min) / (R_max - R_min)), 
              bestAlternativeIndex = Q.indexOf(Math.min(...Q));
        if(config.performance) performance.mark("step 4");

        msg.payload =  {decisionMatrix,weights,bestAlternativeIndex, Q};

          if(config.performance){
              performance.measure("Total",{start:"start",detail:"Total time in (ms)",end:"step 3"})
              performance.measure("Step 1",{start:"start",detail:"Weighted Normalization",end:"step 1"})
              performance.measure("Step 2",{start:"step 1",detail:"Determining Ideal Solutions",end:"step 2"})
              performance.measure("Step 3",{start:"step 2",detail:"Calculating S and R values",end:"step 3"})
              performance.measure("Step 4",{start:"step 3",detail:"Computing Q values",end:"step 4"})
              Object.assign(msg.payload,{performance:performance.getEntriesByType("measure"),inputSize:decisionMatrix.length*decisionMatrix[0].length})
          }
        
        send(msg);
        if(done) done();
      });
    }

    RED.nodes.registerType('vikor',VIKORNode);
      
}