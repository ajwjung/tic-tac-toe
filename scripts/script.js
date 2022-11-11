const Player = (name, marker) => {
    return {
        name,
        marker
    }
}

// Main module to run the game
const Game = (function() {
    const playerOne = Player("Bob", "X");
    const playerTwo = Player("Jack", "O");

    // A module for the board
    const GameBoard = (() => {
        let board = ["X", "O", "X", "O", "X", "O", "X", "O", "O"];
    })();

})();