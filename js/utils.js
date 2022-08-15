import { CELL_VALUE, GAME_STATUS } from "./constants.js";

// Write a function to check status of tic-tac-toe game
// Ref: what is tic-tac-toe game: https://en.wikipedia.org/wiki/Tic-tac-toe
// In summary, tic-tac-toe game has 9 cells divided into 3 rows of 3 cells.
// Each cell can have 3 values: either X, O or empty.
// We say X is win if there are 3 'X' in either horizontal, vertical or diagonal row.
// The same to O.
// If 9 cells is full of values but no one win, then the game is ended.
//
// Given an array of 9 items: [a0, a1, ..., a7, a8] represent for the tic-tac-toe game cells value:
// |  a0  | a1  | a2  |
// |  a3  | a4  | a5  |
// |  a6  | a7  | a8  |
// Each item will receive either of 3 values: empty, X or O.
// Return an object includes two keys:
// - `status`: a string indicate status of the game. It can be one of the following values:
//    - 'X': if X is win
//    - `O`: if O is win
//    - 'END': if game is ended and no one win
//    - 'PLAYING': if no one is win and game is not ended yet.
//
// - `winPositions`:
//    - If X or O is win, return indexes of the 3 winning marks(X/O).
//    - Return empty array.
//
// Example:
// Input array: cellValues = ['X', 'O', 'O', '', 'X', '', '', 'O', 'X']; represent for
// |  X  | O  | O  |
// |     | X  |    |
// |     | O  | X  |
// -----
// ANSWER:
// {
//    status: 'X',
//    winPositions: [0, 4, 8],
// }
//

// Input: an array of 9 items
// Output: an object as mentioned above
export function checkGameStatus(cellValues) {
  // Write your code here ...
  // Please feel free to add more helper function if you want.
  // It's not required to write everything just in this function.

  //check valid cellvalues
  if (!Array.isArray(cellValues) || cellValues.length !== 9) {
    throw new Error('Invalid cellvalue');
  }

  //win

  //liệt kê 8 trường hợp win
  const checkWinList = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
  ];

  //lấy từng giá trị trong từng bộ checkWinList ánh xạ qua cellValues để lấy giá trị tại từng vị trí đó và kiểm tra. 
  //Nếu ko phải là chuối rỗng và đều có cùng giá trị là X hoặc O thì chứng tỏ là đã win (winSetIndex sẽ >= 0)
  const winSetIndex = checkWinList.findIndex(set => {
    const first = cellValues[set[0]];
    const second = cellValues[set[1]];
    const third = cellValues[set[2]];

    return first !== '' && first === second && second === third;
  });

  //return giá trị khi đã win
  if (winSetIndex >= 0) {
    //lay ptu đầu tiên trong mảng đã dc xét là win (vì khi win thì giá trị của 3 thằng là như nhau (X or O) nên lấy thằng nào cũng dc)
    const winValueIndex = checkWinList[winSetIndex][0];

    //sau đó đối chiếu vs mảng cellValues để get nó ra là X hay O
    const winValue = cellValues[winValueIndex];
    return {
      status: winValue === CELL_VALUE.CIRCLE ? GAME_STATUS.O_WIN : GAME_STATUS.X_WIN,
      winPositions: checkWinList[winSetIndex],
    };
  }

  //end

  if (cellValues.filter(x => x === '').length === 0) {
    return {
      status: GAME_STATUS.ENDED,
      winPositions: [],
    };
  }

  //playing
  return {
    status: GAME_STATUS.PLAYING,
    winPositions: [],
  };

}
