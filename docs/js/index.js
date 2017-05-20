
var app = function() {
	
	
    var self = {};
    self.is_configured = false;

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        v.map(function(e) {e._idx = k++;});
    };

    // Initializes an attribute of an array of objects.
    var set_array_attribute = function (v, attr, x) {
        v.map(function (e) {e[attr] = x;});
    };

    self.initialize = function () {
        document.addEventListener('deviceready', self.ondeviceready, false);
    };

    self.ondeviceready = function () {
        // This callback is called once Cordova has finished
        // its own initialization.
        console.log("The device is ready");
        $("#vue-div").show(); // This is jQuery.
        self.is_configured = true;
    };

    self.reset = function () {
        self.vue.board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
		emptyX = 3;
		emptyY = 3;
    };

    self.shuffle = function(i, j) {
        doMoves(i, j)
		self.checkWin();
		
    };
	
	function doMoves(i, j){
		console.log("Shuffle: " + i + ", " + j);
		var board = self.vue.board;
		
		if (board[4*(i-1)+j] == 0){
            temp = board[4*i+j];
            Vue.set(board, 4*i+j, board[4*(i-1)+j]);
            Vue.set(board, 4*(i-1)+j, temp);
        } else if (board[4*(i+1)+j] == 0){
            temp = board[4*i+j];
            Vue.set(board, 4*i+j, board[4*(i+1)+j]);
            Vue.set(board, 4*(i+1)+j, temp);
        } else if (board[4*i+(j-1)] == 0){
            temp = board[4*i+j];
            Vue.set(board, 4*i+j, board[4*i+(j-1)]);
            Vue.set(board, 4*i+(j-1), temp);
        } else if (board[4*i+(j+1)] == 0) {
            temp = board[4*i+j];
            Vue.set(board, 4*i+j, board[4*i+(j+1)]);
            Vue.set(board, 4*i+(j+1), temp);
        } else {
            console.log("Invalid move");
        }
		
	}
	
	
    self.scramble = function() {
        
		var board = self.vue.board
		var currentIndex = board.length, tempVal, randIdx;
		console.log("Current index: " + currentIndex);
		
		while (currentIndex != 0){
			randIdx = Math.floor(Math.random() * currentIndex);
			console.log("Random index: " + randIdx);
			currentIndex -= 1;
			
			tempVal = board[currentIndex];
			Vue.set(board, currentIndex, board[randIdx]);
			Vue.set(board, randIdx, tempVal);
			
			
			
		}
		
		test = isSolvable(board);
		if (test == false){
			self.scramble();
		}

    };
	
	function isSolvable(puzzle) // Adapted from http://stackoverflow.com/questions/34570344/check-if-15-puzzle-is-solvable
	{
		parity = 0;
		gridWidth = Math.sqrt(puzzle.length);
		row = 0; // the current row we are on
		blankRow = 0; // the row with the blank tile

		for (i = 0; i < puzzle.length; i++)
		{
			if (i % gridWidth == 0) { // advance to next row
				row++;
			}
			if (puzzle[i] == 0) { // the blank tile
				blankRow = row; // save the row on which encountered
				continue;
			}
			for (j = i + 1; j < puzzle.length; j++)
			{
				if (puzzle[i] > puzzle[j] && puzzle[j] != 0)
				{
					parity++;
				}
			}
		}

		if (gridWidth % 2 == 0) { // even grid
			if (blankRow % 2 == 0) { // blank on odd row; counting from bottom
				return parity % 2 == 0;
			} else { // blank on even row; counting from bottom
				return parity % 2 != 0;
			}
		} else { // odd grid
			return parity % 2 == 0;
		}
	}
	
	self.checkWin = function(){
		
		for (i = 0; i < 16; i++){
			if(self.vue.board[i] != i+1 && i != 15)
				return;
		}
		alert("Congratulations, you win.");
	}

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            board: []
        },
        methods: {
            reset: self.reset,
            shuffle: self.shuffle,
            scramble: self.scramble
        }

    });

    self.reset();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){
    APP = app();
    APP.initialize();
});
