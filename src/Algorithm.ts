

/**
 * Class with pathfinding algorithm.
 */
export class Algorithm{
    /**
     * 
     * @param array 
     * @returns array of visited squares
     */
    static findWay(array: string[][]){
        var visited: number[][][] = Array.from(Array(array.length), () => Array(array[0].length).fill([]));

        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[0].length; j++) {
                if (array[i][j] == "S") {
                    array[i][j] = "1";
                }
            }
        }
        
        let numberOfVisitedNodesBefore = 0;
        let numberOfVisitedNodesAfter = 0;
        let numberWeAreChecking: number = 1;
        let found: Boolean = false;

        while(true){
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < array[0].length; j++) {
                    
                    if (array[i][j] != numberWeAreChecking.toString()) continue;

                    if (i != array[0].length-1 && array[i+1][j] != "X"){
                        if(array[i+1][j] == "M"){
                            visited[i+1][j] = [...visited[i][j], i*9+j];
                            found = true;
                        }
                        else if(array[i+1][j] == "0"){
                            visited[i+1][j] = [...visited[i][j], i*9+j];
                            array[i+1][j] = (numberWeAreChecking+1).toString()
                            numberOfVisitedNodesAfter++;
                        }
                    }

                    if (i != 0 && array[i-1][j] != "X"){
                        if(array[i-1][j] == "M"){
                            visited[i-1][j] = [...visited[i][j], i*9+j];
                            found = true;
                        }
                        else if(array[i-1][j] == "0"){
                            visited[i-1][j] = [...visited[i][j], i*9+j];
                            array[i-1][j] = (numberWeAreChecking+1).toString()
                            numberOfVisitedNodesAfter++;
                        }
                    }

                    if ( j!=array[0].length-1 && array[i][j+1] != "X"){
                        if(array[i][j+1] == "M"){
                            visited[i][j+1] = [...visited[i][j], i*9+j];
                            found = true;
                        }
                        else if(array[i][j+1] == "0"){
                            visited[i][j+1] = [...visited[i][j], i*9+j];
                            array[i][j+1] = (numberWeAreChecking+1).toString()
                            numberOfVisitedNodesAfter++;
                        }
                    }

                    if (j!=0 && array[i][j-1] != "X"){
                        if(array[i][j-1] == "M"){
                            visited[i][j-1] = [...visited[i][j], i*9+j];
                            found = true;
                        }
                        else if(array[i][j-1] == "0"){
                            visited[i][j-1] = [...visited[i][j], i*9+j];
                            array[i][j-1] = (numberWeAreChecking+1).toString()
                            numberOfVisitedNodesAfter++;
                        }
                    }
                }
            }
            if(found == true) break;
            if(numberOfVisitedNodesBefore == numberOfVisitedNodesAfter) break;
            else numberOfVisitedNodesBefore = numberOfVisitedNodesAfter;
            numberWeAreChecking++;
        }
        if(found == false ) return false;
        for(let i=0; i< visited.length; i++){
            for(let j=0; j<visited[0].length; j++){
                
                if(array[i][j] == "M"){
                    visited[i][j] =  [...visited[i][j], i*9+j];
                    return visited[i][j];
                }
            }
        }
        
    }
}