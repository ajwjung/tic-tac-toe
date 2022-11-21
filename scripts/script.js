const Player = (name, marker) => {
    return { name, marker }
}

// A module for the board
const GameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const resetBoard = () => {
        const newBoard = ["", "", "", "", "", "", "", "", ""]
        return board.splice(0, board.length, ...newBoard);
    }
    
    return { board, resetBoard };
})();

// A module for displaying things
const DisplayController = (() => {
    const gridCells = document.querySelectorAll(".cell");
    let cellClicked = false;

    // Display board contents
    const render = (ind) => {
        gridCells[ind].innerHTML = GameBoard.board[ind];
    };

    const getCurrentMarker = () => {
        const currentPlayer = Turns.getPlayerTurn();

        if (currentPlayer === Game.playerOne.name) return Game.playerOne.marker;
        else if (currentPlayer === Game.playerTwo.name) return Game.playerTwo.marker;
    }

    const placeMarker = () => {
        gridCells.forEach(cell => {
            cell.addEventListener("click", function (e) {
                // get cell ID to use as array index
                const index = e.target.getAttribute("id").slice(-1);

                // only update board if spot is available
                if (GameBoard.board[index].length === 0) {
                    cellClicked = true;
                    GameBoard.board[index] = getCurrentMarker();

                } else return;
                
                render(index);

                // If game was won or ends in tie
                let win = WinStreak.checkForWinner();
                if (win || Turns.checkGameOver()) {
                    disableCells();
                    GameBoard.resetBoard();
                }
            })
        })
    };

    const disableCells = () => {
        gridCells.forEach(cell => cell.classList.add("disable-pointer"))
    }

    const enableCells = () => {
        gridCells.forEach(cell => cell.classList.remove("disable-pointer"))
    }
    
    const msgPara = document.querySelector(".message");
    
    const displayMessage = (message) => {
        msgPara.innerHTML = message;
    }

    const clearMessage = () => {
        msgPara.innerHTML = "Good luck!";
    }

    return { cellClicked, render, placeMarker, disableCells, enableCells,
        displayMessage, clearMessage }

})();

// Module for turns
const Turns = (() => {
    let turnsCounter = 1;
    const startingTurn = 1;
    let gameOver = false;

    const getPlayerTurn = () => {
        // playerOne starts the game
        console.log(turnsCounter);
        if (!(turnsCounter % 2 === 0)) {
            console.log(Game.playerOne);
            return Game.playerOne.name
        } else {
            console.log(Game.playerTwo)
            return Game.playerTwo.name;
        }
    };

    const incrementCounter = () => {
        ++turnsCounter;
        return turnsCounter;
    };

    const checkGameOver = () => {
        turnsCounter == 10 ? gameOver = true : gameOver = false
        return gameOver;
    }

    const resetCounter = () => {
        turnsCounter = startingTurn;
        return turnsCounter;
    }

    return { getPlayerTurn, incrementCounter, checkGameOver, resetCounter };
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

            if (winningMarker == "X") return Game.playerOne.name
            else if (winningMarker == "O") return Game.playerTwo.name
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
                DisplayController.displayMessage(`${winner} wins!`);
                // console.log(`We have a winner! Congratulations ${winner}!`) 
            }
        }

        // game ends as a tie
        if (currentTurn == 10 && !(winnerExists)) {
            DisplayController.displayMessage("The game ended in a tie!");
        }

        return winnerExists
    }

    return { checkForWinner }

})();

const checkForm = (() => {
    const checkEmpty = (player) => {
        if (player.value == "") {
            alert(`${player.name} must enter a name`);
            player.focus();
            return false;
        } else {
            return true;
        }
    }

    return { checkEmpty };

})();

// Main module to run the game
const Game = (() => {
    DisplayController.disableCells();

    // submit form
    const startBtn = document.querySelector("#start");
    const theForm = document.querySelector(".form-container");
    const playerOneName = document.getElementById("player-one");
    const playerTwoName = document.getElementById("player-two");
    let playerOne = Player("", "X");
    let playerTwo = Player("", "O");

    const validateForm = () => {
        if (checkForm.checkEmpty(playerOneName) && checkForm.checkEmpty(playerTwoName)) {
            theForm.classList.toggle("hidden");
            DisplayController.enableCells();
        }
    };

    startBtn.addEventListener("click", function (e) {
        e.preventDefault();
        validateForm();
        playerOne.name = playerOneName.value;
        playerTwo.name = playerTwoName.value;
    });
    
    DisplayController.placeMarker();

    const resetGame = () => {
        GameBoard.resetBoard();
        for (let i = 0; i < 9; i++) {
            DisplayController.render(i);
        }
        DisplayController.clearMessage();
        DisplayController.disableCells();
        // makes form re-appear when restarting new game
        theForm.classList.toggle("hidden");
    };

    const resetBtn = document.querySelector("#reset");
    resetBtn.addEventListener("click", function (e) {
        resetGame();
    })

    return { playerOne, playerTwo }
})();
