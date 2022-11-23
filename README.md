# Tic-Tac-Toe

## Objective

To create a Tic Tac Toe game playable in browser and to practice writing code using the module pattern and factories. Full project details can be found at [The Odin Project's page](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe).

### Specifications

**Requirements**

1. The gameboard should be stored as an array inside of a Gameboard object
    * There should be player objects and an object to control the flow of the game itself

2. Write a function that renders the contents of the gameboard array to the webpage

3. Build functions that allow players to add marks to a specific spot on the board. Players should not be able to play in a spot that is already taken

4. Write logic that checks for when the game is over (i.e., 3-in-a-row or a tie)

5. Add the following features to the interface
    * Allow users to put in their names
    * Add a button to start/restart the game
    * Add a display element that congratulates the winner


**Optional**

Create an AI so that a player can play against the computer

1. Start with getting the computer to make a random legal move

2. Make the computer smart (it's possible to create an unbeatable AI using the minimax algorithm)


## Credits
All icons used in the webpage were downloaded from [Material Design Icons](https://materialdesignicons.com/).

## Author's Notes

One of the hardest parts about this project was figuring out where and how to begin. We had to use the module pattern and factories to encapsulate our variables and functions, that way we would minimize the amount of global variables we used. But I wasn't sure how many modules is considered acceptable or too much, when to use a function or a module, and such.

Having to separate each bit of logic purposefully really got me thinking about how to write better code overall, especially without repeating certain things like referencing the same elements in multiple places. My script is definitely not perfect but it is a step up from the "spaghetti code" I'm used to writing.

Some things I found challenging along the way were:

1. Displaying contents from the `board` array onto the screen
    * *Details:* I didn't know how to access the index of the cell that was clicked on, which I wanted so that I could use it to access the corresponding element in the `board` array. I wanted to give each cell a unique ID that reflected their index but using numbers as IDs can be problematic.
    * *Solution:* I gave each cell an ID of `cell#`, then extracted just the # at the end by slicing. With access to the indexes, I was now able to get each cell's corresponding element in the array.

2. Terminating the game after one player has won
    * *Details:* My game started right when the user clicks any cell and continues, so I had trouble controlling when I actually wanted the game to start and end. After one party won, the players could still click the game and the same congratulations message gets displayed each turn.
    * *Solution:* I stopped the game by disabling pointer events on the cells once one party wins, and this was achieved by toggling a class on the divs.

3. Implementing the reset button
    * *Details:* I found it a bit difficult to implement the reset button because there were many things that required resetting, like the `turnsCounter`, `board`, and re-rendering the board on screen, and I didn't want to use repetitive code.
    * *Solution:* I ended up adding a few reset functions to reset the values of each key variable. It was still a bit challenging because I had to keep in mind the scopes and that any returned value was not actually a reference to the exact same variable. For instance, I couldn't just use `turnsCounter = 0`, I had to create a new variable to store its reset value, then set `turnsCounter` equal to the new variable.

4. Making the form work and only allowing the game to start after the fields are submitted
    * *Details:* I tried to keep the game board disabled until the form is properly submitted (and validated) but the default checks didn't actually validate the form. The cells also weren't disabled even though I used the `disableCells()` method.
    * *Solution:* I created my own simple validation that checks that the input values are not empty. If either one is empty, it will send an alert to input a name. I was also able to disable the cells by calling the function immediately on load, then invoking `enableCells()` to start the game once the form is properly submitted.

### Next Steps:

This was a great eye-opening experience for me to learn more about the different types of functions and how scopes work. I want to continue learning and get a better grasp at the module pattern and factories before returning to attempt the optional AI version of the game.