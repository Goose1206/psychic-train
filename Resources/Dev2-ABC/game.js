"use strict";

function block(icon, tone) {
    this.icon = icon,
    this.tone = tone
};
var currBlocks = [];
var allBlocks = [];
var solutionOrder = [];
var blockPositions = [];
var currentLevel = 1;
var selectedIndex = -1;

PS.init = function(system, options) {
	// set size of grid
	PS.gridSize(9, 9);
    createBlocks();

	// no borders
	PS.border(PS.ALL, PS.ALL, 0);

	// Title
	PS.statusText("Apple Banana Cat");

	// Initialize first level
    loadLevel(currentLevel);
    PS.color(4, 7, 0x00ff00);

    // initialize audio
    PS.audioLoad("xylo_c5", {lock:true});
    PS.audioLoad("xylo_d5", {lock:true});
    PS.audioLoad("xylo_e5", {lock:true});
    PS.audioLoad("xylo_f5", {lock:true});
    PS.audioLoad("xylo_g5", {lock:true});
    PS.audioLoad("xylo_a5", {lock:true});
    PS.audioLoad("xylo_b5", {lock:true});
    PS.audioLoad("xylo_c6", {lock:true});
    PS.audioLoad("fx_click", {lock:true});
    PS.audioLoad("fx_drip2", {lock:true});
};

function createBlocks() {
    allBlocks.push(new block(0x0001F436, "xylo_c5")); // dog
    allBlocks.push(new block(0x0001F3F5, "xylo_d5")); // flower
    allBlocks.push(new block(0x0001F68C, "xylo_e5")); // bus
    allBlocks.push(new block(0x0001FA90, "xylo_f5")); // planet
    allBlocks.push(new block(0x0001F34E, "xylo_g5")); // apple
    allBlocks.push(new block(0x0001F34C, "xylo_a5")); // banana
    allBlocks.push(new block(0x0001F431, "xylo_b5")); // cat
    allBlocks.push(new block(0x0001F31F, "xylo_c6")); // star
};

PS.touch = function(x, y, data, options) {
	// checking answer
	if (x === 4 && y === 7) {
		playOrder();
        return;
	}

    if (y !== 4)
        return;

	let idx = blockPositions.indexOf(x);
    if (idx === -1) return;

    // first click
    if (selectedIndex === -1) {
        PS.audioPlay("fx_drip2", {volume:0.5});
        selectedIndex = idx;
        PS.scale(x, 4, 130);
        PS.border(x, 4, 2);
        PS.borderColor(x, 4, PS.COLOR_YELLOW);
    }
    // second click, swap
    else {
        PS.audioPlay("fx_click", {volume:0.5});
        let temp = currBlocks[selectedIndex];
        currBlocks[selectedIndex] = currBlocks[idx];
        currBlocks[idx] = temp;

        selectedIndex = -1;
        drawBlocks();
    }
    
};

function playOrder() {
    let i = 0;
    let timer = null;

    timer = PS.timerStart(15, function () {
        if (i < currBlocks.length) {
            PS.audioPlay(currBlocks[i].tone);
            i++;
        } else {
            PS.timerStop(timer);
            validateOrder();
        }
    });
}


function validateOrder() {
    // check the current order
    for (let i = 0; i < currBlocks.length; i++) {
        if (currBlocks[i] !== solutionOrder[i]) {
            return;
        }
    }

    currentLevel++;
    loadLevel(currentLevel);
};

function loadLevel(levelID) {
    currBlocks = [];
    solutionOrder = [];
    selectedIndex = -1;

    switch (levelID) {
        case 1:
            currBlocks.push(allBlocks[4], allBlocks[5], allBlocks[6]);
            break;
        case 2:
            currBlocks.push(allBlocks[0], allBlocks[4], allBlocks[5], allBlocks[6]);
            break;
        case 3:
            currBlocks.push(
                allBlocks[0],
                allBlocks[1],
                allBlocks[4],
                allBlocks[5],
                allBlocks[6],
                allBlocks[7]
            );
            break;
        case 4:
            currBlocks.push(
                allBlocks[0],
                allBlocks[1],
                allBlocks[2],
                allBlocks[3],
                allBlocks[4],
                allBlocks[5],
                allBlocks[6],
                allBlocks[7],
            );
            break;
        default:
            currBlocks.push(
                new block("Y", null),
                new block("O", null),
                new block("U", null),
                new block("•", null),
                new block("W", null),
                new block("I", null), 
                new block("N", null));
            break;
    }

    // save correct order
    solutionOrder = currBlocks.slice();

    // shuffle blocks
    if (currentLevel === 1)
        currBlocks.reverse(); // make sure the first level isn't in order
    else if (currentLevel === 5) {}
    else
        currBlocks.sort(() => Math.random() - 0.5);

    drawBlocks();
};

function drawBlocks() {
    // clear row
    for (let x = 0; x < 9; x++) {
        PS.glyph(x, 4, "");
        PS.scale(x, 4, 100);
        PS.border(x, 4, 0);
    }

    blockPositions = [];
    let startX = 4 - Math.floor(currBlocks.length / 2);

    currBlocks.forEach((block, i) => {
        let x = startX + i;
        blockPositions.push(x);
        PS.glyph(x, 4, block.icon);
    });
};