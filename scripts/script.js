const Player = (name, marker) => {
    return { name, marker }
}

// A module for the board
const GameBoard = (() => {
    // Temporary contents
    let board = ["X", "O", "X", "O", "X", "O", "X", "O", "O"];
    
    return { board };
})();

// A module for displaying things
const DisplayController = (() => {
    const gridCells = document.querySelectorAll(".cell");

    // Display board contents
    const render = () => {
        for (let i = 0; i < 9; i++) {
            gridCells[i].innerHTML = GameBoard.board[i];
        }
    };

    const getPlayerTurn = (counter) => {
        // playerOne starts the game
        if (counter % 2 === 0) return "playerOne"
        else return "playerTwo";
    };

    const placeMarker = (p1, p2, counter) => {
        gridCells.forEach(cell => {
            cell.addEventListener("click", function (e) {
                // get cell ID to use as array index
                const index = e.target.getAttribute("id").slice(-1);
                const playerTurn = getPlayerTurn(counter);
                
                // update board array to add new marker
                if (playerTurn === "playerOne") {
                    GameBoard.board[index] = p1.marker;
                } else if (playerTurn === "playerTwo") {
                    GameBoard.board[index] = p2.marker;
                }

                render();
                counter++;
            })
        })
    };

    return { render, placeMarker }
})();

// Main module to run the game
const Game = (() => {
    const playerOne = Player("Bob", "X");
    const playerTwo = Player("Jack", "O");
    let turnsCounter = 0; 
    
    DisplayController.render();
    DisplayController.placeMarker(playerOne, playerTwo, turnsCounter);
})();