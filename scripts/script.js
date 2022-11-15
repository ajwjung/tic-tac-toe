const Player = (name, marker) => {
    return { name, marker }
}

// A module for the board
const GameBoard = (() => {
    // Temporary contents
    // let board = ["X", "O", "X", "O", "X", "O", "X", "O", "O"];
    let board = ["", "", "", "", "", "", "", "", ""];
    
    return { board };
})();

// A module for displaying things
const DisplayController = (() => {
    const gridCells = document.querySelectorAll(".cell");

    // Display board contents
    const render = (ind) => {
        gridCells[ind].innerHTML = GameBoard.board[ind];
    };

    const placeMarker = (p1, p2, counter) => {
        gridCells.forEach(cell => {
            cell.addEventListener("click", function (e) {
                // get cell ID to use as array index
                const index = e.target.getAttribute("id").slice(-1);
                const currentPlayer = Turns.getPlayerTurn();

                // only update board if spot is available
                if (GameBoard.board[index].length === 0) {
                    if (currentPlayer === "playerOne") {
                        GameBoard.board[index] = p1.marker;
                    } else if (currentPlayer === "playerTwo") {
                        GameBoard.board[index] = p2.marker;
                    }
                    Turns.incrementCounter();
                } else return

                render(index);
            })
        })
    };

    return { placeMarker }
})();

// Module for turns
const Turns = (() => {
    let turnsCounter = 1;

    const getPlayerTurn = () => {
        // playerOne starts the game
        if (!(turnsCounter % 2 === 0)) return "playerOne"
        else return "playerTwo";
    };

    const incrementCounter = () => turnsCounter++;

    return { getPlayerTurn, incrementCounter };
})();

// Main module to run the game
const Game = (() => {
    const playerOne = Player("Bob", "X");
    const playerTwo = Player("Jack", "O");

    DisplayController.placeMarker(playerOne, playerTwo);

})();