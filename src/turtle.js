
const THREE = require('three')
import Building from './objects/Building'
  
export default class Turtle {
    
    constructor(grammar) {
        this.building = new Building();
        this.xTrans = 0;
        this.yTrans = 0;
        this.xLength = 2;
        this.yLength = 2;
        this.deltaTrans = 0.25;
        this.deltaLength = 0.25;
        this.currentRoomNum = 0;

        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                // create room with current class variables
                'R' : this.CreateBuildingRoom.bind(this),
                'A' : this.CreateFloorBuildingRoom.bind(this),
                
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
        if (this.currentRoomNum < this.building.floorHeights.length) {
            var currentFloorHeight = this.building.floorHeights[this.currentRoomNum];
            this.building.CreateRoom(currentFloorHeight,
            this.xTrans,
            this.yTrans,
            this.building.totalHeight - currentFloorHeight);
            this.currentRoomNum += 1;
        } else {
            console.log("currentRoomNum is larger than number of floors!")
        }

    }

    CreateFloorBuildingRoom() {
        if (this.currentRoomNum < this.building.floorHeights.length) {
            var currentFloorHeight = this.building.floorHeights[this.currentRoomNum];
            this.building.CreateRoom(currentFloorHeight,
            this.xTrans,
            this.yTrans,
            this.building.totalHeight - currentFloorHeight);
        } else {
            console.log("currentRoomNum is larger than number of floors!")
        }

    }

    NextFloor() {
        this.currentRoomNum += 1;
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
        this.building = new Building();
        this.currentRoomNum = 0;
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