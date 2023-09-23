import {Square} from "./Square"
import { Algorithm } from "./Algorithm";
import { TakingDown } from "./TakingDown";

/**
 * Interface with two coordinates x and y
 */
interface Coords{
    x: number,
    y: number
}

function decorator(){
    return function(
        target: Object,
        property: string,
        descriptor: PropertyDescriptor
    ){
        
        const originalFunction = descriptor.value;

        const newFunction = function(this: Object, ...args: any[]){
            originalFunction.apply(this, args);
            if(args[0]== false) return

            if(document.body.classList.contains("second")){
                document.body.classList.remove("second")
            }
            else document.body.classList.add("second")
        }

        descriptor.value = newFunction;
        return descriptor
    }
}

/**
 * Class with game functionalities
 */
export class Playboard{
    colors: string[] = ["#FFCE30", "#E83845", "#E66101", "#746AB0", "#FFFFFF", "#4DAC26", "#D01C8B"];
    arrayOfSquares: Square[] = []
    matrix: string[][] = [];
    pointsLabel: HTMLHeadElement = document.getElementById("pointsLabel") as HTMLHeadElement;
    ballsPreview: HTMLDivElement = document.getElementById("ballsPreview") as HTMLDivElement;
    points: number=0
    nextBalls: string[] = [];
    checkedCircle: number[] = [-1, -1];
    waitInterval = false;

    constructor(){
        for(let i=1; i<=9; i++){
            this.matrix.push([])
            for(let j=1; j<=9; j++){
                this.arrayOfSquares.push(new Square(i, j))
                this.matrix[i-1].push("0")
            }
        }
        this.arrayOfSquares.forEach(square=>{
            square.div.addEventListener("click", (event)=> this.clickSquareListener(event))
            square.div.addEventListener("mouseover", (event)=> this.mouseOverSquareListener(event))
        })

        for(let i=0; i<3; i++){
            //this.addCircle()
            const colorIndex = Math.floor(Math.random() * this.colors.length);
            this.nextBalls[i] = this.colors[colorIndex];
        }

        this.handlePreview()
    }

    /**
     * Function that creates new circle.
     * @param color 
     */
    addCircle(color: string){
        let x, y;
        
        while(true){
            x = Math.floor(Math.random() * 9);
            y = Math.floor(Math.random() * 9);
            const index = x*9+y;
            if(this.arrayOfSquares[index].circleInsideColor != "null") continue;
            this.putCircle(x+1, y+1, color);
            break;
        }
    }

    /**
     * Click square handler.
     * @param event 
     * @returns 
     */
    clickSquareListener(event: MouseEvent){
        if(this.waitInterval==true) return;

        if (!(event.target instanceof HTMLDivElement)) return
        const div: HTMLDivElement = event.target;
        if(div.dataset.xCord == undefined || div.dataset.yCord == undefined) return
        const xCord = parseInt(div.dataset.xCord);
        const yCord = parseInt(div.dataset.yCord);


        const index = ((xCord-1)*9)+(yCord)-1

        if(
            this.matrix[xCord-1][yCord-1] == "X" && 
            this.checkedCircle[0] == xCord &&
            this.checkedCircle[1] == yCord
            
            ){
            this.checkedCircle = [-1, -1]
            this.arrayOfSquares[index].makeSmaller()
            return
        }

        if(this.arrayOfSquares[index].circleInsideColor != "null"){

            if(
                this.matrix?.[xCord-2]?.[yCord-1] == "0" || 
                this.matrix?.[xCord]?.[yCord-1] == "0" ||
                this.matrix?.[xCord-1]?.[yCord] == "0" ||
                this.matrix?.[xCord-1]?.[yCord-2] == "0"
            ){
            }else{
                return
            }

            
            this.clearDivsBackground()
            if(this.checkedCircle[0] != -1 ){
                const previousBigIndex = ((this.checkedCircle[0]-1)*9)+(this.checkedCircle[1])-1
                this.arrayOfSquares[previousBigIndex].makeSmaller()
            }
            this.arrayOfSquares[index].makeBigger();
            this.checkedCircle = [xCord, yCord]
            return;
        }
        this.moveCircle(xCord, yCord);
    }

    /**
     * Mouse over square handler.
     * @param event 
     * @returns 
     */
    mouseOverSquareListener(event: MouseEvent){
        if(this.waitInterval==true) return;
        if (!(event.target instanceof HTMLDivElement)) return
        const div: HTMLDivElement = event.target;
        
        if(div.dataset.xCord == undefined || div.dataset.yCord == undefined) return
        const xCord = parseInt(div.dataset.xCord);
        const yCord = parseInt(div.dataset.yCord);
        //console.log(xCord,yCord)
        const index = ((xCord-1)*9)+(yCord)-1

        if(this.arrayOfSquares[index].circleInsideColor != "null") {
            this.clearDivsBackground()
            return;
        }
        
        const result =  this.getWay({x: xCord, y: yCord});
        if (result == false || result == undefined) return;

        this.clearDivsBackground()
        result.forEach(node=>{
            this.arrayOfSquares[node].div.classList.add("highlightedSquare");
        })
    }

    /**
     * Function that moves the circle.
     * @param xCord 
     * @param yCord 
     * @returns 
     */
    moveCircle(xCord: number, yCord: number){
        const result =  this.getWay({x: xCord, y: yCord});
        if (result == false || result == undefined) return;

        result.forEach(squareIndex=>{
            this.arrayOfSquares[squareIndex].div.classList.add("highlightedSquare2");
        })
        this.waitInterval = true;
        setTimeout(()=>{
            this.waitInterval = false;
            this.clearDivsBackground()
            this.countingPoints(true)
        }, 1000)
        const colorOfDeleted = this.deleteCircle(this.checkedCircle[0], this.checkedCircle[1])
        this.putCircle(xCord, yCord, colorOfDeleted)
        this.checkedCircle = [-1, -1]
    }

    /**
     * Function that puts circle into array and into div.
     * @param xCord 
     * @param yCord 
     * @param color 
     */
    putCircle(xCord: number, yCord: number, color: string){
        const index = ((xCord-1)*9)+(yCord)-1
        this.matrix[xCord-1][yCord-1] = "X";
        this.arrayOfSquares[index].circleInsideColor = color
        this.arrayOfSquares[index].insertCircle()
        this.arrayOfSquares[index].addCursorPointer()
    }


    /**
     * Function that deletes circle from array and from the div.
     * @param xCord 
     * @param yCord 
     * @returns 
     */
    deleteCircle(xCord: number, yCord: number){
        const index = ((xCord-1)*9)+(yCord)-1;
        const color = this.arrayOfSquares[index].circleInsideColor
        this.arrayOfSquares[index].deleteCircle()
        this.matrix[xCord-1][yCord-1] = "0";
        this.arrayOfSquares[index].removeCursorPointer()
        return color
    }

    /**
     * Function that starts a function that checks if there is path.
     * @param coords  
     * @returns 
     */
    getWay(coords: Coords){
        if(this.checkedCircle[0] == -1) return
        let copy: string[][] = JSON.parse(JSON.stringify(this.matrix))
        
        copy[this.checkedCircle[0]-1][this.checkedCircle[1]-1] = "S";
        copy[coords.x-1][coords.y-1] = "M";
        return Algorithm.findWay(copy);
    }
    
    /**
     * Function that clears all squares backgrounds.
     */
    clearDivsBackground(){
         this.arrayOfSquares.forEach(node=>{
            node.div.classList.remove("highlightedSquare")
            node.div.classList.remove("highlightedSquare2")
        })
    }
    /**
     * Function that count points after taking down circles.
     * @param x 
     */
    @decorator()
    countingPoints(x : boolean){
        let unique: number[] = TakingDown.takeDownAll({array: this.arrayOfSquares})
        
        this.points += unique.length;
        this.pointsLabel.innerText = `Punkty: ${this.points}`

        unique.forEach(squareIndex=>{
            this.deleteCircle(this.arrayOfSquares[squareIndex].x, this.arrayOfSquares[squareIndex].y)
        })

        if(x==true && unique.length == 0) this.handlePreview()
    }
    
    /**
     * Function that handles preview of 3 next circles.
     */
    handlePreview(){
        this.isEnd(3)
        this.ballsPreview.innerHTML = "";
        for(let i=0; i<3; i++){
            this.addCircle(this.nextBalls[i]);
            const nextColorIndex = Math.floor(Math.random() * this.colors.length);
            this.nextBalls[i] = this.colors[nextColorIndex];
            
            let div = document.createElement("div");
            div.classList.add("previewBallDiv");
            let circle = document.createElement("div");
            circle.classList.add("circle");
            circle.style.backgroundColor = this.nextBalls[i]
            div.appendChild(circle)
            this.ballsPreview.appendChild(div)
        }
        this.countingPoints(false)
        this.isEnd(1)
    }
    
    /**
     * Function that checks if the game is over.
     * @param max 
     */
    isEnd(max: number){
        let blanks = 0;
        this.arrayOfSquares.forEach(square=>{
            if(square.circleInsideColor=="null") blanks++;
        })
        if(blanks<max){
            alert(`Koniec! Zdobyłeś ${this.points} punków.`)
        }
       
    }
}