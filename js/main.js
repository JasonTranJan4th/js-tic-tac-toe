import {
    getCellElementAtIdx,
    getCurrentTurnElement,
    getGameStatusElement,
    getCellElementList
} from './selectors.js';

import { TURN } from './constants.js';
import { checkGameStatus } from './utils.js';

console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

function toggleTurn() {
    //toggle turn
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

    //update turn on DOM ele
    const currentTurnEle = getCurrentTurnElement();
    if (currentTurnEle) {
        currentTurnEle.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnEle.classList.add(currentTurn);
    }
}

function handleCellClick(cell, index) {

    //check cell clicked or not
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    if (isClicked) return;

    //set selected cell
    cell.classList.add(currentTurn);

    //toggle turn
    toggleTurn();
}

function initCellElementList() {
    const cellElementList = getCellElementList();

    cellElementList.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(cell, index));
    })
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */


(() => {
    //bind click event for all li element
    initCellElementList();
})();
