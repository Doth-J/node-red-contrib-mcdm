const utils = {
    sum:(arr:number[],initial=0) => arr.reduce((x,sum)=>x+sum,initial),
    sumColumns:(arr:number[][]) => arr.reduce((col,sum)=>col.map((x,index)=>x+sum[index])),
    sumRows: (arr:number[][]) => arr.map((row)=>utils.sum(row)),
    square: (arr:number[]) => arr.map(x=>x*x),
    square2D: (arr:number[][]) => arr.map(x=>utils.square(x)),
    squareRoot: (arr:number[]) => arr.map(x=>Math.sqrt(x)),
    subtractArrays: (arr:number[][], subtractor:number[]) => arr.map((x)=>x.map((val,index)=>val-subtractor[index])),
    divideArrays: (arr:number[][], divisor:number[]) => arr.map((x)=>x.map((val,index)=>val/divisor[index])),
    multiplyArrays: (arr:number[][], multiplier:number[]) => arr.map((x)=>x.map((val,index)=>val*multiplier[index])),
    normalize: (arr:number[]) => arr.map(x=>(x-Math.min(...arr))/(Math.max(...arr)-Math.min(...arr)))
}

export default utils