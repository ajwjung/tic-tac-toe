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

    const placeMarker = (p1, p2) => {
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

                    disableCells(WinStreak.checkForWinner());
                } else return;
                
                render(index);
            })
        })
    };

    const disableCells = (gameWon) => {
        if (gameWon) gridCells.forEach(cell => cell.classList.add("disable-pointer"))
    }

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

    const incrementCounter = () => {
        ++turnsCounter;
        return turnsCounter;
    };

    return { getPlayerTurn, incrementCounter };
})();

const WinStreak = (() => {
    const winningCombos = [
        [0, 1, 2], // row 1
        [3, 4, 5], // row 2
        [6, 7, 8], // row 3
        [0, 3, 6], // col 1
        [1, 4, 7], // col 2
        [2, 5, 8], // col 3
        [0, 4, 8], // diagonal 1
        [2, 4, 6]  // diagonal 2
    ]

    const checkBoard = () => {
        // Check that all elements at each index in the combo are the same marker
        return winningCombos.filter(combo => {
            const [i, j, k] = combo;
            return (
                GameBoard.board[i] == GameBoard.board[j]
                && GameBoard.board[j] == GameBoard.board[k]
                && GameBoard.board[k].length > 0
                )
        });
    };

    const getWinner = () => {
        // Array returned from filter
        const boardResult = checkBoard();
        // Actual combo
        const [winCombo] = boardResult;

        if (boardResult.length > 0) {
            const winningMarker = GameBoard.board[winCombo[0]];

            // Can't we just return the marker by check it against the player object?
            // like playerOne.name or playerOne.marker or something?
            if (winningMarker == "X") return "Player 1"
            else if (winningMarker == "O") return "Player 2"
        } else return;
    };

    const checkForWinner = () => {
        const currentTurn = Turns.incrementCounter();
        let winnerExists = false;

        // check for winner starting from turn 6
        if (currentTurn > 5) {
            const winner = getWinner();
            if (winner) {
                winnerExists = true;
                console.log(`We have a winner! Congratulations ${winner}!`) 
            }
        }

        // game ends as a tie
        if (currentTurn == 10 && !(winnerExists)) {
            console.log("The game ended in a tie!");
        }

        return winnerExists
    }

    return { checkForWinner }

})();

// Main module to run the game
const Game = (() => {
    const playerOne = Player("Bob", "X");
    const playerTwo = Player("Jack", "O");

    DisplayController.placeMarker(playerOne, playerTwo);

})();

/* CURRENT ISSUES: 

- Game does not terminate

- Any moves played after the game was won
will still log the congratulations message

- Game checks for winner after every move 
rather than starting from turn 5-6 when wins are actually possible


*/