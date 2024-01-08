const Player = (name, marker) => {
    return { name, marker }
}

const GameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const resetBoard = () => {
        const newBoard = ["", "", "", "", "", "", "", "", ""]
        return board.splice(0, board.length, ...newBoard);
    }
    
    return { board, resetBoard };
})();

const DisplayController = ((doc) => {
    const gridCells = doc.querySelectorAll(".cell");
    let cellClicked = false;

    // Display board contents
    const render = (ind) => {
        gridCells[ind].innerHTML = GameBoard.board[ind];
        if (GameBoard.board[ind] === "X") {
            gridCells[ind].style.color = "#dc606b"; // reddish color
        } else if (GameBoard.board[ind] === "O") {
            gridCells[ind].style.color = "#356d94"; // blueish color
        }
    };

    const getCurrentMarker = () => {
        const currentPlayer = Turns.getPlayerTurn();

        if (currentPlayer === Game.playerOne.name) {
            return Game.playerOne.marker;
        } else if (currentPlayer === Game.playerTwo.name) {
            return Game.playerTwo.marker;
        }
    }

    const placeMarker = () => {
    /*
        The function updates the clicked cell 
        with the current player's marker on click 
        and also checks whether this move was a winning move.
    */
        gridCells.forEach(cell => {
            cell.addEventListener("click", function (e) {
                // Index from cell ID
                const index = e.target.getAttribute("id").slice(-1);

                // Only update board if spot is available
                if (GameBoard.board[index].length === 0) {
                    cellClicked = true;
                    GameBoard.board[index] = getCurrentMarker();

                } else return;
                
                render(index);

                const playAgainBtn = doc.querySelector(".play-again");
                // Check if game was won or ended in tie
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
    
    const msgPara = doc.querySelector(".message");
    
    const displayMessage = (player, message) => {
    /*
        The function updates the message box and styles the text
        based on which player was passed in.
    */
        msgPara.innerHTML = message;
        
        if (player === Game.playerOne.name) {
            msgPara.style.color = "#dc606b";
        } else if (player === Game.playerTwo.name) {
            msgPara.style.color = "#356d94";
        } else {
            msgPara.style.color = "#86964E";
        }
    }

    const clearMessage = () => {
        msgPara.innerHTML = "Good luck!";
        msgPara.style.color = "#86964E";
    }

    return { cellClicked, render, placeMarker, disableCells, enableCells,
        displayMessage, clearMessage }

})(document);

const Turns = (() => {
    let turnsCounter = 1;
    const startingTurn = 1;
    let gameOver = false;

    const getPlayerTurn = () => {
        // playerOne starts the game (odd turns)
        if (!(turnsCounter % 2 === 0)) {
            return Game.playerOne.name;
        } else {
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
        /*
            The function compares the marker/value in each cell of each winning combo
            to determine whether there was a win, and returns the winning combo, 
            if any. The cells must contain a marker to be considered a win 
            (i.e., empty strings are ignored).

            E.g., If cells 3, 4, and 5 all contained Xs, this would be a win
        */
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
        /*
            The function takes the result from `checkBoard`
            and uses the first index of the winning combo
            to retrieve the winner's marker. Based on the marker,
            the function returns the corresponding player's name.
        */

        // Array returned from filter
        const boardResult = checkBoard();
        // Actual combo
        const [winCombo] = boardResult;

        if (boardResult.length > 0) {
            const winningMarker = GameBoard.board[winCombo[0]];

            if (winningMarker == "X") {
                return Game.playerOne.name;
            }
            else if (winningMarker == "O") {
                return Game.playerTwo.name;
            }
        } else return;
    };

    const checkForWinner = () => {
        /*
            The function begins checking for a win starting from turn 6,
            which is when a win becomes possible, and returns the winner,
            if any.
            
            On end game, a message is displayed to congratulate the player
            or to announce a tie.
        */

        const currentTurn = Turns.incrementCounter();
        let winnerExists = false;

        // Check for winner starting from turn 6
        if (currentTurn > 5) {
            const winner = getWinner();
            if (winner) {
                winnerExists = true;
                DisplayController.displayMessage(winner, `${winner} wins!`);
            }
        }

        // Game ends as a tie
        if (currentTurn == 10 && !(winnerExists)) {
            DisplayController.displayMessage(undefined, "The game ended in a tie!");
        }

        return winnerExists;
    }

    return { checkForWinner }

})();

const checkForm = (() => {
    /*
        The function checks whether the input fields for player names 
        has been filled out, as they are required.
    */

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
const Game = ((doc) => {
    DisplayController.disableCells();

    const startBtn = doc.querySelector("#start");
    const form = doc.querySelector("form");
    const playerOneName = doc.getElementById("player-one");
    const playerTwoName = doc.getElementById("player-two");
    const namesContainer = doc.querySelector(".player-names");
    const playAgainBtn = doc.querySelector(".play-again");
    let playerOne = Player("", "X");
    let playerTwo = Player("", "O");

    const validateForm = () => {
    /*
        The function checks the input fields and, if they are valid,
        starts the game.
    */
        if (checkForm.checkEmpty(playerOneName) && checkForm.checkEmpty(playerTwoName)) {
            form.classList.toggle("hidden");
            DisplayController.enableCells();
        }
    };

    const updatePlayerNames = () => {
        /*
            The function displays the players' names in place of the input fields.
        */

        const player1 = doc.querySelector(".p1");
        const player2 = doc.querySelector(".p2");

        player1.textContent = `${playerOneName.value} (${Game.playerOne.marker})`;
        player2.textContent = `${playerTwoName.value} (${Game.playerTwo.marker})`;
        namesContainer.classList.toggle("hidden");
    };

    // Handles the start button
    startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        validateForm();
        playerOne.name = playerOneName.value;
        playerTwo.name = playerTwoName.value;
        updatePlayerNames();
    });
    
    // Allows users to take turns playing the game
    DisplayController.placeMarker(doc);

    const resetGame = () => {
        /*
            The function resets the gameboard both logically and visually
            to its initial state. Players are required to enter their names again.
        */

        GameBoard.resetBoard();
        Turns.resetCounter();
        for (let i = 0; i < 9; i++) {
            DisplayController.render(i);
        }
        DisplayController.clearMessage();
        DisplayController.disableCells();
        // makes form re-appear when restarting new game
        form.classList.toggle("hidden");
        namesContainer.classList.toggle("hidden");
        playAgainBtn.classList.add("hidden");
    };

    const resetBtn = doc.querySelector("#reset");
    resetBtn.addEventListener("click", resetGame);

    return { playerOne, playerTwo }
})(document);
