import * as NodeRED from "node-red";
import utils from "./utils";

interface MOORANodeConfig extends NodeRED.NodeDef{
  performance:boolean
}

export = function(RED:NodeRED.NodeAPI){

  
  function MOORANode(this:NodeRED.Node, config:MOORANodeConfig){
      RED.nodes.createNode(this,config);
      
      this.on('input',(msg:any,send,done)=>{
        const {decisionMatrix,weights} = msg.payload;
        
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

        const squaredColumnSums = utils.squareRoot(utils.sumColumns( utils.square2D(decisionMatrix))),
        normalizedMatrix = utils.divideArrays(decisionMatrix,squaredColumnSums);
        if(config.performance) performance.mark("step 1");

        const referencePoints = normalizedMatrix.map(row => row.reduce((sum, val, idx) => sum + val * weights[idx], 0));
        if(config.performance) performance.mark("step 2");

        const ranks = referencePoints.map((point, idx) => ({idx, point})).sort((a, b) => b.point - a.point).map((item, rank) => ({alternative: item.idx + 1, rank: rank + 1}));;
        if(config.performance) performance.mark("step 3");

        msg.payload =  {decisionMatrix,weights,referencePoints,ranks};

        if(config.performance){
            performance.measure("Total",{start:"start",detail:"Total time in (ms)",end:"step 3"})
            performance.measure("Step 1",{start:"start",detail:"Normalizing the Decision Matrix",end:"step 1"})
            performance.measure("Step 2",{start:"step 1",detail:"Calculating Reference Points",end:"step 2"})
            performance.measure("Step 3",{start:"step 2",detail:"Computing Ranks for Alternatives",end:"step 3"})
            Object.assign(msg.payload,{performance:performance.getEntriesByType("measure"),inputSize:decisionMatrix.length*decisionMatrix[0].length})
        }
        
        send(msg);
        if(done) done();
      });
    }

    RED.nodes.registerType('moora',MOORANode);
      
}