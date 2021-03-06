
// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
export function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}
//-----------------------------------------------------------------------------------------------------------
// Linked List class:
// fields : head, tail, of the linked list
function LinkedList(node1, node2) {
	this.head = node1; 
	this.tail = node2; 
}

// Node class 
// fields: prev, sym, next (todo: metadata)
function Node(previous, nex, symbol) {
	// sym is a string
	this.sym = symbol;
	this.prev = previous;
	this.next = nex; 
}

// Linked List Functions:

// function to symmetrically link 2 nodes together
// parameters: two Node objects
function linkNodes(node1, node2) {
	node1.next = node2;
	node2.prev = node1; 
}

// A function to expand one of the symbol nodes of the linked list by replacing it with several new nodes. 
// This function should look at the list of rules associated with the symbol in the linked list’s grammar dictionary, 
// then generate a uniform random number between 0 and 1 in order to determine which of the Rules should be used to 
// expand the symbol node. You will refer to a Rule’s probability and compare it to your random number in order to 
// determine which Rule should be chosen.
function findReplace(currNode, linkedList, grammar) {
	// consider all relavant rules 
	var currGram = grammar[currNode.sym];
	

	// using the random number, decide which validRule to choose
	var rand = Math.random();
	var totalRules = currGram.length;
	var accumulatedProb = 0.0; 

	// the chosen Rule - to be updated in the loop
	var chosenRule = currGram[0];

	for (var i = 0; i < currGram.length; i++) {
		// define a range for each of the Rules based on their probability
		if (rand > accumulatedProb && rand <= accumulatedProb + currGram[i].probability) {
			chosenRule = currGram[i];
		}
		accumulatedProb += currGram[i].probability; 
	}

	// create new chain of nodes based on the Rule replacement
	// return the string 
	return chosenRule.successorString;
}

//-----------------------------------------------------------------------------------------------------------

// Turn the string into linked list 
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	if (typeof input_string !== "undefined") {
		var headNode = new Node(null,  null, input_string.charAt(0));
		var prev = headNode;
		var tailNode = headNode;
		for (var i = 1; i < input_string.length; i++) {
			var newNode = new Node(prev, null, input_string.charAt(i));
			tailNode = newNode;
			prev.next = newNode;
			prev = newNode;
			
		}

	}

	var ll = new LinkedList(headNode, tailNode);
	return ll;
}

// Return a string form of the LinkedList
export function LinkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";
	var currNode = linkedList.head;
	while (currNode) {
		result += currNode.sym;
		currNode = currNode.next;
	}
	return result;
}

// Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {

	var subLinkedList = stringToLinkedList(replacementString);
	// edge case: single axiom
	if (linkedList.head === linkedList.tail) {
		linkedList.head = subLinkedList.head; 
		linkedList.tail = subLinkedList.tail;
	} else {
		// find the place of node in linkedList
		var curr = linkedList.head;
		while (curr) {
			if (curr === node) {

				if (curr.prev) {
					curr.prev.next = subLinkedList.head;
					subLinkedList.head.prev = curr.prev;
				} else { //is head
					linkedList.head = subLinkedList.head
				}

				if (curr.next) {
					curr.next.prev = subLinkedList.tail;
				} else { //is tail
					linkedList.tail = subLinkedList.tail;
				}

				subLinkedList.head.prev = curr.prev;
				subLinkedList.tail.next = curr.next;
			}
			curr = curr.next;
		}
	}
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	var lowerFloorBound = 2
	var upperFloorBound = 4

	//generate number of floors
	var numMFloors = Math.floor((Math.random() * upperFloorBound) + lowerFloorBound);
	var axiom = "F";

	for (var i = 0; i < numMFloors; i++) {
		axiom = axiom.concat("M");
	}
	axiom = axiom.concat("L?")

	this.axiom = axiom;
	console.log(axiom)
	this.grammar = {};

	//f for first floor, rules for single room or multiroom
	//S and M
	this.grammar['F'] = [
		new Rule(0.6, 'R'),
		new Rule(0.4, 'A')
	]

	this.grammar['?'] = [ //is there an antennae?
		new Rule(0.8, ''),
		new Rule(0.2, '!')
	]

	this.grammar['M'] = [
		new Rule(0.7, 'R'),
		new Rule(0.3, 'SA')
	]

	this.grammar['L'] = [
		new Rule(0.8, 'R'),
		new Rule(0.2, 'SSA')
	]

	//Multi room, A adds another room to the floor (does not start new floor)
	this.grammar['A'] = [
		new Rule(0.6, 'CCA'),
		new Rule(0.3, 'CCCA'),
		new Rule(0.1, 'CCCCA')
	]


	this.grammar['R'] = [
		new Rule(0.6, 'CCR'),
		new Rule(0.3, 'CCCR'),
		new Rule(0.1, 'CCCCR')
	]

	this.grammar['C'] = [
		new Rule(0.05, 'T'),
		new Rule(0.9, 'S'),
	]

	this.grammar['T'] = [
		new Rule(0.25, 'X'),
		new Rule(0.25, 'Y'),
		new Rule(0.25, 'x'),
		new Rule(0.25, 'y'),
	]
	this.grammar['S'] = [
		new Rule(0.45, 'u'), // Decrease x length
		new Rule(0.05, 'U'),
		new Rule(0.45, 'v'), // decrease y length
		new Rule(0.05, 'V'),
	]

	//m for middle floor

	//last for last floor
	//C is for translations
	//T is translate
	//R is switch current translate axis
	//E is extrude
	//X is increase x trans
	//Y is increase y trans
	//x is decrease x trans
	//y is decrease y trans

	this.iterations = 0; 
	
	// Set up the axiom string
	if (typeof axiom !== "undefined") {
		this.axiom = axiom;
	}

	// Set up the grammar as a dictionary that 
	// maps a single character (symbol) to a Rule.
	if (typeof grammar !== "undefined") {
		this.grammar = Object.assign({}, grammar);
	}
	
	// Set up iterations (the number of times you 
	// should expand the axiom in DoIterations)
	if (typeof iterations !== "undefined") {
		this.iterations = iterations;
	}

	// A function to alter the axiom string stored 
	// in the L-system
	this.updateAxiom = function(axiom) {
		// Setup axiom
		if (typeof axiom !== "undefined") {
			this.axiom = axiom;
		}
	}

	// This function returns a linked list that is the result 
	// of expanding the L-system's axiom n times.
	// The implementation we have provided you just returns a linked
	// list of the axiom.
	this.doIterations = function(n) {	
		var origString = this.axiom;

		// base case: empty string
		if (n === 0) {
			var lSystemLL = stringToLinkedList(this.axiom);
		} else {
			// convert original string to nodes
			var lSystemLL = stringToLinkedList(origString);


			for (var i = 0; i < n; i++) {
				// iterate through the linked list n times
				var currNode = lSystemLL.head;

				

				while (currNode) {
					// check if the currNode sym has any listings in grammar

					if (this.grammar[currNode.sym]) {
						// then findReplace what string should replace the current node
						var replacementString = findReplace(currNode, lSystemLL, this.grammar);
						// then replaceNode with the new string
						replaceNode(lSystemLL, currNode, replacementString); 
						
						/*
						var curr = lSystemLL.head
						while (curr != null) {
							console.log(curr.sym)
							curr = curr.next
						}*/
					}
					// go onto the next node
					currNode = currNode.next; 
				}
			}
		}
		return lSystemLL;
	}
}