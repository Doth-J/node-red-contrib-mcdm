import * as NodeRED from "node-red";
import utils from "./utils";

interface TOPSISNodeConfig extends NodeRED.NodeDef{
  performance:boolean,
  maximize:boolean
}

export = function(RED:NodeRED.NodeAPI){

    function TOPSISNode(this:NodeRED.Node, config:TOPSISNodeConfig){
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
        
        const squaredMatrix = utils.square2D(decisionMatrix),
              squaredColumnSums = utils.squareRoot(utils.sumColumns(squaredMatrix)),
              normalizeddecisionMatrix = utils.divideArrays(decisionMatrix,squaredColumnSums),
              weightedMatrix = utils.multiplyArrays(normalizeddecisionMatrix,weights);
        if(config.performance) performance.mark("step 1");
        
        const weightedRowSums = weightedMatrix.map((row)=>utils.sum(row)),
              PIS = weightedMatrix[weightedRowSums.indexOf(config.maximize ? Math.max(...weightedRowSums):Math.min(...weightedRowSums))],
              NIS =  weightedMatrix[weightedRowSums.indexOf(!config.maximize ? Math.max(...weightedRowSums):Math.min(...weightedRowSums))];
        if(config.performance) performance.mark("step 2");
        
        const distnancePIS = utils.squareRoot(utils.sumRows(utils.square2D(utils.subtractArrays(weightedMatrix,PIS)))),
              distnanceNIS = utils.squareRoot(utils.sumRows(utils.square2D(utils.subtractArrays(weightedMatrix,NIS))));
        if(config.performance) performance.mark("step 3");
        
        const scores = distnancePIS.map((distToIdeal, index) => distnanceNIS[index] / (distToIdeal + distnanceNIS[index]));
        if(config.performance) performance.mark("step 4");
    
        msg.payload = {decisionMatrix,weights,scores}

        if(config.performance){
          performance.measure("Total",{start:"start",detail:"Total time in (ms)",end:"step 4"})
          performance.measure("Step 1",{start:"start",detail:"Weighted Normalized Decision Matrix",end:"step 1"})
          performance.measure("Step 2",{start:"step 1",detail:"Calculating Ideal and Negative-Ideal Solutions",end:"step 2"})
          performance.measure("Step 3",{start:"step 2",detail:"Calculating Euclidean Distances",end:"step 3"})
          performance.measure("Step 4",{start:"step 3",detail:"Computing Scores",end:"step 4"})
          Object.assign(msg.payload,{performance:performance.getEntriesByType("measure"),inputSize:decisionMatrix.length*decisionMatrix[0].length})
        }
        
        send(msg);
        if(done) done();
      });
    }

    RED.nodes.registerType('topsis',TOPSISNode);
      
}