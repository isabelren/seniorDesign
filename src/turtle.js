
const THREE = require('three')
import Building from './objects/Building'

var maxBottomRoomLength = 5;
  
export default class Turtle {
    
    constructor(upperHeightBound=3, grammar) {
        this.upperHeightBound=upperHeightBound;
        this.building = new Building(upperHeightBound);
        this.xTrans = 0;
        this.yTrans = 0;
        this.xLength = 2;
        this.yLength = 2;
        this.deltaTrans = 0.25;
        this.deltaLength = 0.25;
        this.currentFloorNum = 0;
        this.prevIncremented = false;

        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                // create room with current class variables
                'R' : this.CreateBuildingRoom.bind(this), //Goes to next floor
                'A' : this.CreateFloorBuildingRoom.bind(this),
                '!' : this.CreateAntennae.bind(this),
                
                'x' : this.DecreaseXTrans.bind(this),
                'X' : this.IncreaseXTrans.bind(this),
                'y' : this.DecreaseYTrans.bind(this),
                'Y' : this.IncreaseYTrans.bind(this),

                'u' : this.DecreaseXLength.bind(this),
                'U' : this.IncreaseXLength.bind(this),
                'v' : this.DecreaseYLength.bind(this),
                'V' : this.IncreaseYLength.bind(this),
            };
        } else {
            this.renderGrammar = grammar;
        }
        console.log(this.renderGrammar)
    }

    CreateBuildingRoom() {
        if (this.currentFloorNum < this.building.floorHeights.length) {
            var currentFloorHeight = this.building.floorHeights[this.currentFloorNum];

            var maxRoomLength = (this.building.floorHeights.length - this.currentFloorNum)/this.building.floorHeights.length * maxBottomRoomLength;
            this.building.CreateRoom(currentFloorHeight,
            this.xTrans,
            this.yTrans,
            maxRoomLength);
            
            this.currentFloorNum += 1;
            this.prevIncremented = true;
        } else {
            console.log("currentFloorNum is larger than number of floors!")
        }

    }

    CreateFloorBuildingRoom() {
        if (this.currentFloorNum < this.building.floorHeights.length) {
            var currentFloorHeight = this.building.floorHeights[this.currentFloorNum];
            var maxRoomLength = (this.building.floorHeights.length - this.currentFloorNum)/this.building.floorHeights.length * maxBottomRoomLength;

            this.building.CreateRoom(
                currentFloorHeight,
                this.xTrans,
                this.yTrans,
                maxRoomLength);

            this.prevIncremented = false;
        } else {
            console.log("currentFloorNum is larger than number of floors!")
        }

    }

    CreateAntennae() {
        if (this.prevIncremented) {
            this.currentFloorNum--;
        }
        var currentHeight = this.building.floorHeights[this.currentFloorNum];

        var antHeight = currentHeight + 1 + (Math.random() * currentHeight/3 );
        this.building.CreateRoom(
                antHeight,
                this.xTrans,
                this.yTrans,
                0.14, 
                0.08);

    }

    NextFloor() {
        this.currentFloorNum += 1;
    }

    DecreaseXTrans() {
        this.xTrans -= this.deltaTrans;
    }

    IncreaseXTrans() {
        this.xTrans += this.deltaTrans;
    }

    DecreaseYTrans() {
        this.yTrans -= this.deltaTrans;
    }

    IncreaseYTrans() {
        this.yTrans += this.deltaTrans;
    }


    DecreaseXLength() {
        this.xLength -= this.deltaLength;
    }

    IncreaseXLength() {
        this.xLength += this.deltaLength;
    }

    DecreaseYLength() {
        this.yLength -= this.deltaLength;
    }

    IncreaseYLength() {
        this.yLength += this.deltaLength;
    }

    getAndResetBuilding() {
        var currentBuilding = this.building;
        this.building = new Building(this.upperHeightBound);
        this.currentFloorNum = 0;
        return currentBuilding;

    }
    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode) {
        var func = this.renderGrammar[symbolNode.sym];
        if (func) {
            func();
        }
    };

    // Invoke renderSymbol for every node in a linked list of grammar symbols.
    renderSymbols(linkedList) {
        var currentNode;
        for(currentNode = linkedList.head; currentNode != null; currentNode = currentNode.next) {
            this.renderSymbol(currentNode);
        }
    }
}