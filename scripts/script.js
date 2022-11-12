const Player = (name, marker) => {
    return { name, marker }
}

// A module for the board
const GameBoard = (() => {
    let board = ["X", "O", "X", "O", "X", "O", "X", "O", "O"];
    const gridCells = document.querySelectorAll(".cell");

    // Display board contents
    const render = () => {
        for (let i = 0; i < 9; i++) {
            gridCells[i].innerHTML = board[i];
        }
    }

    return { board, render };
})();

// Main module to run the game
const Game = (function() {
    const playerOne = Player("Bob", "X");
    const playerTwo = Player("Jack", "O");
    
    GameBoard.render();
})();