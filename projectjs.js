var board;
var score = 0;
var rows = 4;
var columns = 4;
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;

window.onload = function() {
    setGame();
    loadHighScore(); // Load high score on startup
}

function loadHighScore() {
    document.getElementById("high-score").innerText = highScore; // Display the high score
}
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore); // Save new high score to local storage
        document.getElementById("high-score").innerText = highScore; // Update the high score display
    }
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1] && row[i] !== 0) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            updateTile(tile, board[r][c]);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // Clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener('keyup', (e) => {
    if (e.code === "ArrowLeft") {
        slideLeft();
    } else if (e.code === "ArrowRight") {
        slideRight();
    } else if (e.code === "ArrowUp") {
        slideUp();
    } else if (e.code === "ArrowDown") {
        slideDown();
    }

    document.getElementById("score").innerText = score;
    updateHighScore(); 

    if (noMovesAvailable()) {
        document.getElementById("game-over-message").classList.remove("hidden");
    } else {
        setTwo();
    }
});

function filterZero(row) {
    return row.filter(num => num !== 0);
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r].slice().reverse(); // Create a copy and reverse
        row = slide(row);
        board[r] = row.reverse(); // Reverse back to original order
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile() && noMovesAvailable()) {
        document.getElementById("game-over-message").classList.remove("hidden");
        return;
    }

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] === 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return true;
            }
        }
    }
    return false;
}

function noMovesAvailable() {
    // Check if there are any empty tiles. If so, moves are still available.
    if (hasEmptyTile()) return false;

    // Check for possible horizontal merges
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            // If two horizontally adjacent tiles are the same, a merge is possible
            if (board[r][c] === board[r][c + 1]) {
                return false;
            }
        }
    }

    // Check for possible vertical merges
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            // If two vertically adjacent tiles are the same, a merge is possible
            if (board[r][c] === board[r + 1][c]) {
                return false;
            }
        }
    }

    // If no empty tiles and no possible merges, then no moves are available
    return true;
}



function resetGame() {
    console.log("resetGame");
    score = 0;
    document.getElementById("score").innerText = score;

    // Reinitialize the board to an empty state
    board = Array.from({ length: rows }, () => Array(columns).fill(0));

    // Update the UI for each tile
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            updateTile(tile, board[r][c]);
        }
    }

    // Hide the game over message
    document.getElementById("game-over-message").classList.add("hidden");

    // Set two tiles to start the game
    setTwo();
    setTwo();
}


