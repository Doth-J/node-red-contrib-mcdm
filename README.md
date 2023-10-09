# node-red-contrib-mcdm
This is a collection of Node-RED nodes for working with [*Multi-Criteria Decision Making*](https://en.wikipedia.org/wiki/Multiple-criteria_decision_analysis) algorithms in your flow.

⚠️ **These algorithms are not optimized and are computationally intensive, although they can wrapped and used as functions.** ⚠️

## Installation ⚡
To install the node execute the following command inside the .node-red directory:
```console
npm install node-red-contrib-mcdm
```
You can also install the collection from the Node-RED editor *Manage palette* option of the menu.

### Local Incubator Server ⚙️
Clone the github repository by executing the following command:
```console
git clone https://github.com/Doth-J/node-red-contrib-mcdm.git
```
Inside the project directory, install the dependencies and start the incubator server executing the commands:
```console
cd ./node-red-contrib-mcdm
npm install;
npm start
```
A Node-RED incubator server will start in [http://localhost:1880](http://localhost:1880) already loaded with the Multi-Criteria Decision Making nodes:
```console
> node-red-contrib-madm@0.0.1 start
> node incubator/server.js 

8 Oct 20:34:28 - [info] 

Welcome to Node-RED
===================
.
8 Oct 20:34:32 - [info] Started Node-RED server: http://localhost:1880
8 Oct 20:34:32 - [info] Starting flows
8 Oct 20:34:32 - [info] Started flows
```

## Multi Criteria Decision Making (*MCDM*) 📚
Multi-Criteria Decision Making, also known as MCDM, refers to making decisions in the presence of multiple, usually conflicting, criteria. The aim is to find the best possible solution by considering multiple decision criteria, which are typically conflicting in nature. These criteria can be quantitative or qualitative in nature.

### Analytical Hierarchy Process (*AHP*) 📗
Analytic Hierarchy Process, also known as AHP, is a structured technique for organizing and analyzing complex decisions. AHP provides a comprehensive and rational framework for structuring a decision problem, for representing and quantifying its elements, and for relating those elements to the overall goals. AHP offers a mathematical and systematic approach to decision-making where multiple, often conflicting, criteria are involved. The **AHP Node** can be used by injecting a Pairwise Comparison Matrix  to evaluate the relative importance of criteria through pairwise comparisons:

⚠️ **Pairwise Comparison Matrix must be a square array!**
  ![AHP Example Flow](https://github.com/Doth-J/node-red-contrib-mcdm/blob/main/docs/ahp.png?raw=true)
- ***Payload Format:***
    ```json
    [
        [...], // Pairwise Comparison for Criteria #1
        [...], // Pairwise Comparison for Criteria #2
        [...], // Pairwise Comparison for Criteria #3
         ...
    ]
    ```
- ***Node Response:***
    ```json
    {
        "paiwiseComparisonMatrix":[
            [...], // Pairwise Comparison for Criteria #1
            [...], // Pairwise Comparison for Criteria #2
            [...], // Pairwise Comparison for Criteria #3
             ...
        ],
        "priorities":[
            p1, // Priority Vector #1
            p2, // Priority Vector #2
            p3, // Priority Vector #3
            ...
        ]
    }
    ```

### Simple Additive Weighting (*SAW*) 📗
Simple Additive Weighting, also known as the weighted sum model or SAW, is a popular Multi-Criteria Decision-Making (MCDM) method, utilized to determine the best option among a set of alternatives evaluated against multiple criteria. SAW is favored for its simplicity and ease of use, making it applicable to a wide array of decision-making problems. The **SAW Node** can be used by injecting a decision matrix and the corresponding weight for each of the criteria:

![SAW Example Flow](https://github.com/Doth-J/node-red-contrib-mcdm/blob/main/docs/saw.png?raw=true)
- ***Payload Format:***
    ```json
    {
        "decisionMatrix":[
            [...], // Alternative #1
            [...], // Alternative #2
            [...], // Alternative #3
             ...
        ],
        "weights":[
            w1, // Weight for Criteria #1
            w2, // Weight for Criteria #2
            w3, // Weight for Criteria #3
            ...
        ]
    }
    ```
- ***Node Response:***
    ```json
    {
        "decisionMatrix":[
            [...], // Alternative #1
            [...], // Alternative #2
            [...], // Alternative #3
             ...
        ],
        "weights":[
            w1, // Weight for Criteria #1
            w2, // Weight for Criteria #2
            w3, // Weight for Criteria #3
            ...
        ],
        "scores":[
            s1, // Score for Alternative #1
            s2, // Score for Alternative #2
            s3, // Score for Alternative #3
            ...
        ],
        "bestAlternativeIndex": X // Highest Ranking Alternative
    }
    ```

### Technique for Order of Preference by Similarity to Ideal Solution (*TOPSIS*) 📗
Technique for Order of Preference by Similarity to Ideal Solution, also known as TOPSIS, is a multi-criteria decision-making (MCDM) method, developed to solve complex decision-making problems. TOPSIS assists decision-makers in identifying the best alternative from a set of available alternatives evaluated based on multiple, often conflicting, criteria. TOPSIS provides a robust method for handling complex MCDM problems, offering a logical approach to identifying the best alternative by considering the distance to ideal and negative-ideal solutions. The **TOPSIS Node** can be used by injecting a decision matrix and the corresponding weight for each of the criteria: 

![TOPSIS Example Flow](https://github.com/Doth-J/node-red-contrib-mcdm/blob/main/docs/topsis.png?raw=true)
- ***Payload Format:***
    ```json
    {
        "decisionMatrix":[
            [...], // Alternative #1
            [...], // Alternative #2
            [...], // Alternative #3
             ...
        ],
        "weights":[
            w1, // Weight for Criteria #1
            w2, // Weight for Criteria #2
            w3, // Weight for Criteria #3
            ...
        ]
    }
    ```
- ***Node Response:***
    ```json
    {
        "decisionMatrix":[
            [...], // Alternative #1
            [...], // Alternative #2
            [...], // Alternative #3
             ...
        ],
        "weights":[
            w1, // Weight for Criteria #1
            w2, // Weight for Criteria #2
            w3, // Weight for Criteria #3
            ...
        ],
        "scores":[
            s1, // Score for Alternative #1
            s2, // Score for Alternative #2
            s3, // Score for Alternative #3
            ...
        ]
    }
    ```

### Multi-Objective Optimization on the basis of Ratio Analysis (*MOORA*) 📗
Multi-Objective Optimization on the basis of Ratio Analysis, also known as MOORA, is a multi-criteria decision-making (MCDM) method, used to determine the best alternative from a set of available alternatives, which are evaluated based on multiple, usually conflicting, criteria. MOORA focuses on optimizing multiple objectives, which are transformed into non-dimensional ratios to establish a more straightforward comparison between different alternatives. The **MOORA Node** can be used by injecting a decision matrix and the corresponding weight for each of the criteria: 

![MOORA Example Flow](https://github.com/Doth-J/node-red-contrib-mcdm/blob/main/docs/moora.png?raw=true)
- ***Payload Format:***
    ```json
    {
        "decisionMatrix":[
            [...], // Alternative #1
            [...], // Alternative #2
            [...], // Alternative #3
             ...
        ],
        "weights":[
            w1, // Weight for Criteria #1
            w2, // Weight for Criteria #2
            w3, // Weight for Criteria #3
            ...
        ]
    }
    ```
- ***Node Response:***
    ```json
    {
        "decisionMatrix":[
            [...], // Alternative #1
            [...], // Alternative #2
            [...], // Alternative #3
             ...
        ],
        "weights":[
            w1, // Weight for Criteria #1
            w2, // Weight for Criteria #2
            w3, // Weight for Criteria #3
            ...
        ],
        "referencePoints":[
            rp1, // Reference Point for Alternative #1
            rp2, // Reference Point for Alternative #2
            rp3, // Reference Point for Alternative #3
            ...
        ],
        "ranks":[
            r1, // Rank for Alternative #1
            r2, // Rank for Alternative #2
            r3, // Rank for Alternative #3
            ...
        ]
    }
    ```

### VlseKriterijumska Optimizacija I Kompromisno Resenje (*VIKOR*) 📗
Vlsekriterijumska Optimizacija I Kompromisno Resenje, also known as VIKOR, is a multi-criteria decision-making (MCDM) method that focuses on ranking and selecting from a set of alternatives and determines compromise solutions for a problem with conflicting criteria. VIKOR is particularly useful when the decision-maker cannot express an explicit preference regarding the importance of the criteria, introducing a particular measure of 'closeness' to the 'ideal' solution. The **VIKOR Node** allows configuration of the "*Majority Rule*" and can be used by injecting a decision matrix and the corresponding weight for each of the criteria: 

![MOORA Example Flow](https://github.com/Doth-J/node-red-contrib-mcdm/blob/main/docs/moora.png?raw=true)
- ***Payload Format:***
    ```json
    {
        "decisionMatrix":[
            [...], // Alternative #1
            [...], // Alternative #2
            [...], // Alternative #3
             ...
        ],
        "weights":[
            w1, // Weight for Criteria #1
            w2, // Weight for Criteria #2
            w3, // Weight for Criteria #3
            ...
        ]
    }
    ```
- ***Node Response:***
    ```json
    {
        "decisionMatrix":[
            [...], // Alternative #1
            [...], // Alternative #2
            [...], // Alternative #3
             ...
        ],
        "weights":[
            w1, // Weight for Criteria #1
            w2, // Weight for Criteria #2
            w3, // Weight for Criteria #3
            ...
        ],
        "referencePoints":[
            rp1, // Reference Point for Alternative #1
            rp2, // Reference Point for Alternative #2
            rp3, // Reference Point for Alternative #3
            ...
        ],
        "ranks":[
            r1, // Rank for Alternative #1
            r2, // Rank for Alternative #2
            r3, // Rank for Alternative #3
            ...
        ]
    }
    ```

### Preference Ranking Organization Method for Enrichment of Evaluations (*PROMETHEE*) 📗
Preference Ranking Organization Method for Enrichment of Evaluations, also known as PROMETHEE, is a multi-criteria decision-making method that ranks alternatives by comparing them pairwise concerning multiple criteria. The method uses preference functions to manage these comparisons and employs a pairwise comparison matrix to determine flows which are used to rank the alternatives. The **PROMETHEE Node** allows configuration of the "*Preference Function*" with the corresponding values for the criterion applies and can be used by injecting a decision matrix and the corresponding weight for each of the criteria: 

- ***Preference Functions:***
 1. **Usual Criterion**: 
    ```js
    alternatives[i] >= alternatives[j] ? 0 : 1*
    ```
 2. **Level Criterion**: 
    ```js
    Math.abs(alternatives[i] - alternatives[j]) <= parameters[0] ? 0 : (alternatives[i] > alternatives[j] ? 1 : 0)
    ```
 3. **Quasi Criterion**:
    ```js
    Math.abs(alternatives[i] - alternatives[j]) <= parameters[1] ? (alternatives[i] > alternatives[j] ? 1 : 0) : 0
    ```
 4. **Gaussian Criterion**: 
    ```js
    alternatives[i] <= alternatives[j] ? 0 : -Math.exp(-Math.pow(alternatives[i] - alternatives[j],2) / (2 * Math.pow(parameters[2],2)))
    ```
 5. **Linear Criterion**: **
    ```js
    if(alternatives[i] - alternatives[j] <= parameters[0]) 0;
    else if(alternatives[i] - alternatives[j] >= parameters[2]) 1;
    else{
        (alternatives[i] - alternatives[j] - parameters[0]) / (parameters[2] - parameters[0])
    }
    ```

![PROMETHEE Example Flow](https://github.com/Doth-J/node-red-contrib-mcdm/blob/main/docs/promethee.png?raw=true)
- ***Payload Format:***
    ```json
    {
        "decisionMatrix":[
            [...], // Alternative #1
            [...], // Alternative #2
            [...], // Alternative #3
             ...
        ],
        "weights":[
            w1, // Weight for Criteria #1
            w2, // Weight for Criteria #2
            w3, // Weight for Criteria #3
            ...
        ]
    }
    ```
- ***Node Response:***
    ```json
    {
        "decisionMatrix":[
            [...], // Alternative #1
            [...], // Alternative #2
            [...], // Alternative #3
             ...
        ],
        "weights":[
            w1, // Weight for Criteria #1
            w2, // Weight for Criteria #2
            w3, // Weight for Criteria #3
            ...
        ],
        "ranks":[
            r1, // Ranking for Alternative #1
            r2, // Ranking for Alternative #2
            r3, // Ranking for Alternative #3
            ...
        ]
    }
    ```

