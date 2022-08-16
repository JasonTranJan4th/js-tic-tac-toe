/*delegation là gì?
    delegation là 1 behavior cho phép ng dùng ko cần thao tác trên các ptu con mà chỉ handle nơi thằng cha
    VD:  ul và li. Ko cần addEventListener vào từng thẻ li mà chỉ cần thêm vào thằng ul nhưng vẫn handle dc các li
*/
import {
    getCellElementAtIdx,
    getCurrentTurnElement,
    getGameStatusElement,
    getCellElementList,
    getReplayButtonElement
} from './selectors.js';

import { CELL_VALUE, GAME_STATUS, TURN } from './constants.js';
import { checkGameStatus } from './utils.js';

console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let gameStatus = GAME_STATUS.PLAYING;
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

function updateGameStatus(newGameStatus) {
    gameStatus = newGameStatus;

    const gameStatusEle = getGameStatusElement();

    if (gameStatusEle) gameStatusEle.textContent = gameStatus;
}

function showReplayButton() {
    const replayButton = getReplayButtonElement();

    if (replayButton) replayButton.classList.add('show');
}

function hideReplayButton() {
    const replayButton = getReplayButtonElement();

    if (replayButton) replayButton.classList.remove('show');
}

function highLightWinCell(winPositions) {
    if (!Array.isArray(winPositions) || winPositions.length !== 3) {
        throw new Error('Invalid win position');
    }

    for (const position of winPositions) {
        const cell = getCellElementAtIdx(position);

        if (cell) cell.classList.add('win');
    }
}

function handleCellClick(cell, index) {

    //check cell clicked or not
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
    if (isClicked || isEndGame) return; // nếu đã click vào từng ô rồi hoặc khi game kết thúc rồi thì ko dc click nữa

    //set selected cell
    cell.classList.add(currentTurn);

    //đưa giá trị của ô dc click vào mảng cellValues dùng để check win or not
    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    //toggle turn
    toggleTurn();

    //check win or not
    const game = checkGameStatus(cellValues);

    switch (game.status) {
        case GAME_STATUS.ENDED: {
            //update game status
            updateGameStatus(game.status);
            //show replay button
            showReplayButton();
            break;
        }

        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN: {
            //update game status
            updateGameStatus(game.status);

            //show replay button
            showReplayButton();

            //highlight win cell 
            highLightWinCell(game.winPositions);
            break;
        }

        default:
        //is playing
    }
}

// chưa dùng delegation
// function initCellElementList() {
//     const cellElementList = getCellElementList();

//     cellElementList.forEach((cell, index) => {
//         cell.addEventListener('click', () => handleCellClick(cell, index));
//     })
// }

//khi dùng delegation
function initCellElementList() {

    //vì ko lấy dc index của từng li như khi dùng foreach nên tự thêm index vào mỗi thẻ li 
    const liList = getCellElementList();
    liList.forEach((li, index) => {
        li.dataset.idx = index;
    })

    //lấy thẻ ul
    const ulEle = document.getElementById('cellList');
    if (ulEle) {
        ulEle.addEventListener('click', (event) => {
            if (event.target.tagName !== 'LI') return; // nếu ko phải là the li thì ko làm gì

            const index = Number.parseInt(event.target.dataset.idx);
            handleCellClick(event.target, index); // event.target là từng thẻ li
        })
    }
}

function resetGame() {
    //reset các variable
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => ""); // chuyen tat ca cac ptu trong mang thanh chuoi rong

    // reset dom ele bao gồm:
    //reset game status
    updateGameStatus(GAME_STATUS.PLAYING);

    //reset current turn
    const currentTurnEle = getCurrentTurnElement();
    if (currentTurnEle) {
        currentTurnEle.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnEle.classList.add(TURN.CROSS);
    }

    //reset gameboard
    const cellEleList = getCellElementList();
    for (const cellEle of cellEleList) {
        cellEle.className = ''; //clear toan bo class co trong ele
    }

    //hide replay button
    hideReplayButton();
}

function initReplayButton() {
    const replayButton = getReplayButtonElement();

    if (replayButton) {
        replayButton.addEventListener('click', resetGame)
    }
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

    //handle replay button
    initReplayButton();
})();
