import {Square} from "./Square"

/**
 * unnecessarily created interface
 */
interface ArrayOfSquares{
    array: Square[]
}
/**
 * Class with functions that are looking for pawns to take down.
 */
export class TakingDown{
    /**
     * Function that collects all the pieces to be taken down.
     * @param array 
     * @returns 
     */
    static takeDownAll(array: ArrayOfSquares){
        let takenDown: number[] = [];
        takenDown.push.apply(takenDown, this.takeDownHorizontally(array.array))
        takenDown.push.apply(takenDown, this.takeDownVertically(array.array))
        takenDown.push.apply(takenDown, this.takeDownDiagonally(array.array))

        var unique = takenDown.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        })

        return unique;
    }
    /**
     * Function that collects horizonally pieces to be taken down.
     * @param array 
     * @returns
     */
    static takeDownHorizontally(array: Square[]){
        let takenDown : number[] = [];

        let lastColor = "";
        let streak = 1;
        let index = -1;

        array.forEach(square=>{
            index++;
            if(square.circleInsideColor == lastColor && square.circleInsideColor!="null") streak++
            else{
                if(streak>=5){
                    for(let i=0; i<streak; i++){
                        takenDown.push(index-i-1)
                    }
                }
                streak = 1;
                lastColor = square.circleInsideColor
            }

            if((index+1)%9 == 0){
                if(streak>=5){
                    for(let i=0; i<streak;i++){
                        takenDown.push(index-i)
                    }
                }
                lastColor = "";
                streak=1;
            }
        })
        return takenDown;
    }
    /**
     * Function that collects vertically all the pieces to be taken down.
     * @param array 
     * @returns
     */
    static takeDownVertically(array: Square[]){
        let takenDown : number[] = [];

        let lastColor = "";
        let streak = 1;
        let index = 0;

        for(let i=0; i<9; i++){
           for(let j=0; j<9; j++){
                index=j*9+i

                if(array[index].circleInsideColor == lastColor && array[index].circleInsideColor!="null") streak++
                else{
                    if(streak>=5){
                        for(let k=0; k<streak; k++){
                            takenDown.push(index-k*9-9)
                        }
                    }
                    streak = 1;
                    lastColor = array[index].circleInsideColor
                }

                if(index>=72){
                    if(streak>=5){
                        for(let k=0; k<streak; k++){
                            takenDown.push(index-k*9)
                        }
                    }
                    lastColor = "";
                    streak=1;
                }
                
            }
        }
        return takenDown;
    }
    /**
     * Function that collects diagonally all the pieces to be taken down.
     * @param array 
     * @returns
     */
    static takeDownDiagonally(array: Square[]){
        let takenDown : number[] = [];

        const startLeft = [36, 27, 18, 9,0, 1,2,3,4]
        const startRight = [4,5,6,7,8,17,26,35,44]

        startLeft.forEach(index => {
            let checkIndex = index
            let lastColor = "";
            let streak = 1;

            while(true){
                if(array[checkIndex].circleInsideColor == lastColor && array[checkIndex].circleInsideColor!="null") streak++
                else{
                    if(streak>=5){
                        for(let k=0; k<streak; k++){
                            takenDown.push(checkIndex-k*10-10)
                        }
                    }
                    streak = 1;
                    lastColor = array[checkIndex].circleInsideColor
                }

                if(checkIndex>=72 || (checkIndex+1)%9==0){
                    
                    if(streak>=5){
                        for(let k=0; k<streak; k++){
                            takenDown.push(checkIndex-k*10)
                        }
                    }
                    break
                }
                checkIndex+=10
            }
            
        });

        startRight.forEach(index => {
            let checkIndex = index
            let lastColor = "";
            let streak = 1;

            while(true){
                if(array[checkIndex].circleInsideColor == lastColor && array[checkIndex].circleInsideColor!="null") streak++
                else{
                    if(streak>=5){
                        for(let k=0; k<streak; k++){
                            takenDown.push(checkIndex-k*8-8)
                        }
                    }
                    streak = 1;
                    lastColor = array[checkIndex].circleInsideColor
                }

                if(checkIndex>=72 || (checkIndex)%9==0){
                    
                    if(streak>=5){
                        for(let k=0; k<streak; k++){
                            takenDown.push(checkIndex-k*8)
                        }
                    }
                    break
                }
                checkIndex+=8
            }
            
        });

        return takenDown;
    }
}