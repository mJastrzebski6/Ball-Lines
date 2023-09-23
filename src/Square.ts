/**
 * Class respresending one element of grid.
 */

export class Square {
    x: number
    y: number
    div: HTMLDivElement
    circleDiv: HTMLDivElement = document.createElement("div")
    circleInsideColor: string

    constructor(x: number,y: number){
        this.x = x;
        this.y = y;

        this.div = document.createElement("div");
        this.div.classList.add("square")
        this.div.dataset.xCord = x.toString();
        this.div.dataset.yCord = y.toString();
        //this.div.innerText = ((x-1)*9+y-1).toString()

        document.getElementById("playboard")?.appendChild(this.div)
        this.circleInsideColor = "null"
    }
    /**
     * Adding circle to the square.
     */
    insertCircle(){
        this.circleDiv.classList.add("circle")
        this.circleDiv.style.backgroundColor = this.circleInsideColor;
        this.div.appendChild(this.circleDiv)
    }
    /**
     * Deleting circle from the square.
     */
    deleteCircle(){
        this.makeSmaller()
        this.circleInsideColor = "null";
        this.div.innerHTML = ""
    }
    /**
     * Making circle inside div bigger.
     */
    makeBigger(){
        let circle = this.div.firstChild as HTMLDivElement;
        circle.classList.remove("circle");
        circle.classList.add("checkedCircle");
    }
    /**
     * Making circle in div smaller.
     */
    makeSmaller(){
        let circle = this.div.firstChild as HTMLDivElement;
        circle.classList.remove("checkedCircle");
        circle.classList.add("circle");
    }
    /**
     * Adding cursor pointer to the square.
     */
    addCursorPointer(){
        this.div.classList.add("checkedSquare");
    }
    /**
     * Deleting cursor pointer from the square.
     */
    removeCursorPointer(){
        this.div.classList.remove("checkedSquare");
    }
}