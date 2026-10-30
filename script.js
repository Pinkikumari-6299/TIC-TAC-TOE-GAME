console.log("Welcome to Tic Tac Toe");

// Adding game sounds
let music = new Audio("music.mp3");
let audioTurn = new Audio("ting.mp3");
let gameover = new Audio("gameover.mp3");

// Basic game variables
let turn = "X";
let isgameover = false;
let gameMode = "friend";

const modeSelect = document.getElementById("modeSelect");

// Change game mode
modeSelect.addEventListener("change", (e) => {
    gameMode = e.target.value;
    resetGame();
});

// Change the turn between X and O
const changeTurn = () => {
    return turn === "X" ? "0" : "X";
};

// All possible winning combinations
const winPatterns = [
    [0, 1, 2, "row-0"],
    [3, 4, 5, "row-1"],
    [6, 7, 8, "row-2"],
    [0, 3, 6, "col-0"],
    [1, 4, 7, "col-1"],
    [2, 5, 8, "col-2"],
    [0, 4, 8, "diag-1"],
    [2, 4, 6, "diag-2"]
];

// Check if anyone has won
const checkWin = () => {
    let boxtext = document.getElementsByClassName("boxtext");

    winPatterns.forEach(pattern => {

        if (
            boxtext[pattern[0]].innerText === boxtext[pattern[1]].innerText &&
            boxtext[pattern[1]].innerText === boxtext[pattern[2]].innerText &&
            boxtext[pattern[0]].innerText !== ""
        ) {

            let winner = boxtext[pattern[0]].innerText;

            if (gameMode === "computer" && winner === "0") {
                document.querySelector(".info").innerText = "Computer Won";
            } else {
                document.querySelector(".info").innerText = winner + " Won";
            }

            isgameover = true;

            document.querySelector(".imgbox img").style.width = "200px";

            // Draw the winning line
            let line = document.querySelector(".line");
            let container = document.querySelector(".container");
            let size = container.clientWidth;

            if (pattern[3] === "row-0") {
                line.style.transform = `translate(0px, ${size * 0.166 - 3}px) rotate(0deg)`;
                line.style.width = `${size}px`;
            }

            else if (pattern[3] === "row-1") {
                line.style.transform = `translate(0px, ${size * 0.5 - 3}px) rotate(0deg)`;
                line.style.width = `${size}px`;
            }

            else if (pattern[3] === "row-2") {
                line.style.transform = `translate(0px, ${size * 0.833 - 3}px) rotate(0deg)`;
                line.style.width = `${size}px`;
            }

            else if (pattern[3] === "col-0") {
                line.style.transform = `translate(${size * 0.166 - size / 2}px, ${size / 2 - 3}px) rotate(90deg)`;
                line.style.width = `${size}px`;
            }

            else if (pattern[3] === "col-1") {
                line.style.transform = `translate(0px, ${size / 2 - 3}px) rotate(90deg)`;
                line.style.width = `${size}px`;
            }

            else if (pattern[3] === "col-2") {
                line.style.transform = `translate(${size * 0.833 - size / 2}px, ${size / 2 - 3}px) rotate(90deg)`;
                line.style.width = `${size}px`;
            }

            else if (pattern[3] === "diag-1") {
                let diagLen = size * 1.414;
                line.style.transform = `translate(${(size - diagLen) / 2}px, ${size / 2 - 3}px) rotate(45deg)`;
                line.style.width = `${diagLen}px`;
            }

            else if (pattern[3] === "diag-2") {
                let diagLen = size * 1.414;
                line.style.transform = `translate(${(size - diagLen) / 2}px, ${size / 2 - 3}px) rotate(135deg)`;
                line.style.width = `${diagLen}px`;
            }
        }
    });
};

// Check if the game is a draw
const checkDraw = () => {
    let boxtexts = document.querySelectorAll(".boxtext");
    let filledCount = 0;

    boxtexts.forEach(element => {
        if (element.innerText !== "") {
            filledCount++;
        }
    });

    if (filledCount === 9 && !isgameover) {
        document.querySelector(".info").innerText = "It's a Draw!";
        isgameover = true;
    }
};

// Find a winning move or a move to block the player
const findBestMovePattern = (symbol) => {
    let boxtext = document.getElementsByClassName("boxtext");

    for (let pattern of winPatterns) {

        let [a, b, c] = pattern;

        let values = [
            boxtext[a].innerText,
            boxtext[b].innerText,
            boxtext[c].innerText
        ];

        let matchCount = values.filter(value => value === symbol).length;
        let emptyCount = values.filter(value => value === "").length;

        if (matchCount === 2 && emptyCount === 1) {

            if (boxtext[a].innerText === "") return a;
            if (boxtext[b].innerText === "") return b;
            if (boxtext[c].innerText === "") return c;
        }
    }

    return null;
};

// Computer's turn
const makeComputerMove = () => {

    if (isgameover) return;

    let boxes = document.getElementsByClassName("box");
    let boxtext = document.getElementsByClassName("boxtext");

    let targetIndex = null;

    // First, check if computer can win
    targetIndex = findBestMovePattern("0");

    // Try to block the player's winning move
    if (targetIndex === null && Math.random() < 0.80) {
        targetIndex = findBestMovePattern("X");
    }

    // Sometimes choose the center or a corner
    if (targetIndex === null && Math.random() < 0.35) {

        if (boxtext[4].innerText === "") {
            targetIndex = 4;
        }

        else {
            let corners = [0, 2, 6, 8].filter(i => boxtext[i].innerText === "");

            if (corners.length > 0) {
                targetIndex = corners[Math.floor(Math.random() * corners.length)];
            }
        }
    }

    // If no move is selected, choose a random empty box
    if (targetIndex === null) {

        let emptyIndexes = [];

        Array.from(boxtext).forEach((element, index) => {
            if (element.innerText === "") {
                emptyIndexes.push(index);
            }
        });

        if (emptyIndexes.length > 0) {
            targetIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        }
    }

    // Place computer's O
    if (targetIndex !== null) {

        let selectedBoxText = boxes[targetIndex].querySelector(".boxtext");

        selectedBoxText.innerHTML = '<span class="o">O</span>';
        selectedBoxText.style.color = "#FF2EC4";

        turn = changeTurn();

        audioTurn.play();

        checkWin();
        checkDraw();

        if (!isgameover) {
            document.querySelector(".info").innerText = "Turn for " + turn;
        }
    }
};

// Handle player moves
let boxes = document.getElementsByClassName("box");

Array.from(boxes).forEach(element => {

    let boxtext = element.querySelector(".boxtext");

    element.addEventListener("click", () => {

        if (boxtext.innerText === "" && !isgameover) {

            if (turn === "X") {
                boxtext.innerHTML = '<span class="x">X</span>';
                boxtext.style.color = "#00E5FF";
            }

            else {
                boxtext.innerHTML = '<span class="o">O</span>';
                boxtext.style.color = "#FF2EC4";
            }

            turn = changeTurn();

            audioTurn.play();

            checkWin();
            checkDraw();

            if (!isgameover) {

                document.querySelector(".info").innerText = "Turn for " + turn;

                // Make computer play after the player's turn
                if (gameMode === "computer" && turn === "0") {
                    setTimeout(() => {
                        makeComputerMove();
                    }, 400);
                }
            }
        }
    });
});

// Reset the game
const resetGame = () => {

    let boxtexts = document.querySelectorAll(".boxtext");

    Array.from(boxtexts).forEach(element => {
        element.innerText = "";
        element.style.color = "";
    });

    turn = "X";
    isgameover = false;

    document.querySelector(".line").style.width = "0px";

    document.querySelector(".info").innerText = "Turn for " + turn;

    document.querySelector(".imgbox img").style.width = "0";
};

// Reset button
reset.addEventListener("click", resetGame);
