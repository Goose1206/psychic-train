/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-22 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these two lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

// globals
const HEIGHT = 32;
const WIDTH = 31;

var skyCount = 0;
var dialogue = [];
var audio = [];
// bg 31x97
// fg 31x26
var BGsprite, FGsprite;

PS.init = function(system, options) {
	// set size of grid
	PS.gridSize(HEIGHT, WIDTH);

	// no borders
	PS.border(PS.ALL, PS.ALL, 0);

	// Title
	PS.statusText("Press Space to Move On");

	// Add any other initialization code you need here.
	InitBG();
	InitFG();
	InitText();
	InitAudio();

	// initialize audio
	PS.audioLoad("hchord_gb5", {lock : true});
	PS.audioLoad("hchord_db5", {lock : true});

};

PS.keyDown = function(key) {
	if (key === PS.KEY_SPACE && skyCount < 93) {
		Update();
		PS.debug("space pressed");
	}
};

function Update() {
	if (skyCount < 93) {
		// update bg
		if (skyCount < 83)
			PS.spriteMove(BGsprite, 0, 14 + skyCount);

		// update text + audio
		if (audio[skyCount] === "hchord_db5")
			PS.statusColor(0x1d5f85);
		else
			PS.statusColor(0x802867);

		PS.statusText(dialogue[skyCount]);
		if (audio[skyCount] != "") 
			PS.audioPlay(audio[skyCount], {volume:0.5});
	}
	else
		Finish();

	skyCount++;
};

function InitBG() {
	let onImageLoad = function ( image ) {
		if ( image === PS.ERROR )
			return;

		BGsprite = PS.spriteImage( image );
		PS.spriteAxis(BGsprite, 0, 96);
		PS.spriteMove(BGsprite, 0, 14);
		PS.spritePlane(BGsprite, 0);
	};

	PS.imageLoad("Sunset.bmp", onImageLoad);
};

function InitFG() {
	let onImageLoad = function ( image ) {
		if ( image === PS.ERROR )
			return;

		FGsprite = PS.spriteImage( image );
		PS.spriteAxis(FGsprite, 0, 25);
		PS.spriteMove(FGsprite, 0, HEIGHT - 1);
		PS.spritePlane(FGsprite, 1);
	};

	PS.imageLoad("Fg.PNG", onImageLoad);
};

function InitText() {
	// fill dialogue array
	fetch("dialogue.txt")
    .then(response => {
        if (!response.ok) throw new Error("Failed to load text");
        return response.text();
    })
    .then(text => {
        dialogue = text.split("\n").map(line => line.trim());
    })
    .catch(err => console.error(err));
};

function InitAudio() {
	fetch("audio.txt")
    .then(response => {
        if (!response.ok) throw new Error("Failed to load audio text");
        return response.text();
    })
    .then(text => {
        audio = text.split("\n").map(line => line.trim());
    })
    .catch(err => console.error(err));
};

function Finish() {
	PS.statusFade();
	PS.statusColor(0xffffff);
	PS.spriteDelete(BGsprite);
	PS.spriteDelete(FGsprite);
};