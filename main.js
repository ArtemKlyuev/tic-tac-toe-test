let origBoard;
const firstPlayer = {
    character: 'X',
    text: 'крестики'
};
const secondPlayer = {
    character: 'O',
    text: 'нолики'
};

let activePlayer = firstPlayer;

const winCombosArr = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.table__cell');

window.onload = () => cells.forEach((el, index) => el.dataset.id = index);


const startGame = () => {
    activePlayer = firstPlayer;
    document.querySelector('.text').textContent = `Сейчас ходят ${activePlayer.text}`;
    origBoard = Array.from(Array(9).keys());
    cells.forEach(el => {
        el.textContent = '';
        el.removeAttribute('style');
        el.addEventListener('click', turnClick);
        el.addEventListener('click', turnPlayer);
    });
};

document.querySelector('.btn-replay').onclick = startGame;


const turnPlayer = () => {
    if (activePlayer === firstPlayer) {
        activePlayer = secondPlayer;
    } else {
        activePlayer = firstPlayer;
    }
    document.querySelector('.text').textContent = `Сейчас ходят ${activePlayer.text}`
};

const turnClick = (event) => {
    origBoard.forEach((el, index) => {
        if (el === 'X' || el === 'O') {
            cells[index].removeEventListener('click', turnClick);
            cells[index].removeEventListener('click', turnPlayer);
        }
    });
    const dataId = event.target.dataset.id;
    if (typeof origBoard[dataId] === 'number' && !checkTie(turn(dataId, activePlayer.character))) {
        turn(dataId, activePlayer.character);
    }
};

const turn = (dataId, player) => {
    origBoard[dataId] = player;
    document.querySelector(`[data-id="${dataId}"`).textContent = player;
    const gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
    return gameWon;
};

const checkWin = (board, player) => {
    const plays = board.reduce((sum, currentItem, index) => (currentItem === player) ? sum.concat(index) : sum, []);
    let gameWon = null;
    for (let [index, win] of winCombosArr.entries()) {
        if (win.every(el => plays.includes(el))) {
            gameWon = {
                index: index,
                player: player
            };
            break;
        };
    }
    return gameWon;
};

const gameOver = gameWon => {
    for (let index of winCombosArr[gameWon.index]) {
        document.querySelector(`[data-id="${index}"]`).style.backgroundColor = 'green';
        cells.forEach(el => {
            el.removeEventListener('click', turnClick);
            el.removeEventListener('click', turnPlayer);
        });
    }
    declareWinner(gameWon.player === firstPlayer.character ? 'Победили крестики' : 'Победили нолики!');
};

const declareWinner = text => {
    document.querySelector('.text').textContent = text;
};

const emptySquares = () => origBoard.filter(square => typeof square === 'number');

const checkTie = (gameWon) => {
    if (gameWon) return false;
    if (emptySquares().length === 0) {
        cells.forEach(el => {
            el.style.backgroundColor = 'gray';
            el.removeEventListener('click', turnClick);
            el.removeEventListener('click', turnPlayer);
        });
        declareWinner('Ничья!');
        return true;
    }
    return false;
};

startGame();