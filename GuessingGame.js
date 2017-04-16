//generateWinningNumber: returns a random num between 1-100
function generateWinningNumber() {
    return Math.floor(Math.random() * 100 + 1);
}

//shuffle: uses the Fisher-Yates shuffle-in-place to shuffle the given array
function shuffle(array) {

    var m = array.length;
    var i;
    var temp;

    //while there are elements still to shuffle...
    while (m) {

        //pick a remaining element, call it "i"
        i = Math.floor(Math.random() * m--);

        //swap "i" with the current element (towards the front), "m"
        temp = array[m];
        array[m] = array[i];
        array[i] = temp;
    }

    return array;
}

//GAME CONSTRUCTOR
function Game() {

    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

//GAME PROTOTYPE METHODS

//difference - returns absolute value of diff between guess and real winning number
Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

//isLower - "true" if player guess is lower than real num
Game.prototype.isLower = function() {

    if (this.playersGuess < this.winningNumber) {
        return true;
    }

    return false;
}

//playersGuessSubmission - submits guess, checks it, assigns it to playersGuess
Game.prototype.playersGuessSubmission = function(num) {

    if (num < 1 || num > 100 || isNaN(num)) {
        throw "That is an invalid guess.";
    }
    else {
        this.playersGuess = num;
    }

    return this.checkGuess(num);
}

//helper function: checkGuess
Game.prototype.checkGuess = function(guess) {

    //if it's right, they win!
    if (this.playersGuess === this.winningNumber) {
        $("#hint, #gobutton").prop("disabled", true);
        $("#subtitle").text("Press the 'Reset' button to play again!");
        return "You Win!";
    }
    //if it's a duplicate guess, tell them so
    else if (this.pastGuesses.indexOf(guess) !== -1) {
        return "You have already guessed that number.";
    }
    //otherwise, add it to pastGuesses
    else {
        this.pastGuesses.push(this.playersGuess);
        //display it in the guess list
        $('#guesses li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
    }
    
    //------------------------------------
    //if this is their 5th guess, tell them they lose
    
    if (this.pastGuesses.length > 4) {
        $("#hint, #gobutton").prop("disabled", true);
        $("#subtitle").text("Press the 'Reset' button to play again!");
        return "You Lose.";
    }

    //if lower:
    if (this.isLower()) {
        $("#subtitle").text("Guess higher!");
    }
    //if higher:
    else if (!this.isLower()) {
        $("#subtitle").text("Guess lower!");
    }

    //if they're close:
    if (this.difference() < 10) {
        return "You're burning up!";
    }
    //if they're lukewarm:
    else if (this.difference() < 25) {
        return "You're lukewarm.";
    }
    //if they're chilly
    else if (this.difference() < 50) {
        return "You're a bit chilly.";
    }
    //if they're faaar away
    else if (this.difference() < 100) {
        return "You're ice cold!";
    }

}

//newGame: creates a new iteration of Game
function newGame() {
    return new Game();
}

//provideHint: creates array of 3 numbers, one of which is winningNum, in shuffled order
Game.prototype.provideHint = function() {
    var hintArray = [];

    hintArray.push(this.winningNumber);
    hintArray.push(generateWinningNumber());
    hintArray.push(generateWinningNumber());

    shuffle(hintArray);

    return hintArray;
}

//*************************************** */

function makeAGuess(game) {
    //assign player input to guess
    var guess = $("#player-input").val();
    //clear player-input
    $("#player-input").val("");
    //send guess to playersGuessSubmission
    var output = game.playersGuessSubmission(parseInt(guess, 10));
    $("#title").text(output);
}

//JQUERY BEGINS HERE
$(document).ready(function() {

    //create new game instance
    var game = new Game();

    //when gobutton is pressed
   $("#gobutton").click(function() {
        makeAGuess(game);
        //reautofocus on input
        $("#player-input").focus();

    });

    //if "enter" key is pressed rather than the button, thats fine
    $("#player-input").keypress(function(event) {
        if (event.which == 13) {
            makeAGuess(game);
        }
    });

    //when reset button is pressed
    $("#reset").click(function() {
        game = new Game();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #gobutton').prop("disabled",false);
        $("player-input").focus();
    });

    //when hint button is pressed
    $("#hint").click(function() {
        var hints = game.provideHint();
        $("#title").text("The winning number is " + hints[0] + ", " + hints[1] + ", or " + hints[2] + ".");
    });

});