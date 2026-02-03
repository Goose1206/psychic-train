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

var FLOWER = {
	// CONSTANTS
	GRID_WIDTH: 24, // width of grid
	GRID_HEIGHT: 24, // height of grid
	BOTTOM_ROW: 22, // last row of sky
	FRAME_RATE: 6,	// animation frame rate; 6/60ths = 10 fps
	BG_COLOR: 0x81c7e6, // background color
	STEM_COLOR: 0x309c1a, // stem color

	stemX: 1,
	stemY: 1,
	x: 0,
	y: 0,
	isGrowing: false,

	// FLOWER.tick()
	// Called on every clock tick
	// Used to animate the stems
	tick : function() 
	{
		if (FLOWER.isGrowing)
		{
			if (FLOWER.y >= FLOWER.stemY) 
			{
				// grow the stem
				PS.color(FLOWER.x, FLOWER.y, FLOWER.STEM_COLOR);

				// subtract 1 from y position
				FLOWER.y -= 1;
			}
			else {
				FLOWER.growFlower()
			}
		}
	},

	growFlower: function()
	{
		// randomize flower type: round, tulip, bulb
		var flower = Math.floor(Math.random() * 3);

		// randomize flower color: white, yellow, orange, pink, purple
		var petals = Math.floor(Math.random() * 5);
		var color;
		switch(petals)
		{
			case 0:
				color = 0xffffff; // white
				break;
			case 1:
				color = 0xf5e451; // yellow
				break;
			case 2:
				color = 0xfcaa1c; // orange
				break;
			case 3:
				color = 0xf788c3; // pink
				break;
			case 4:
				color = 0xd088f7; // purple
				break;
		}

		// render flower based on above
		switch(flower)
		{
			case 0: // round
				for (var i = -1; i < 2; i++)
					for(var j = -1; j < 2; j++)
						PS.color(FLOWER.stemX - i, FLOWER.stemY - j, color);
				PS.color(FLOWER.stemX, FLOWER.stemY, 0x6e4204);
				PS.audioPlay("fx_tweet");
				FLOWER.isGrowing = false;
				break;
			case 1: // tulip
				PS.color(FLOWER.stemX, FLOWER.stemY, color);
				PS.color(FLOWER.stemX, FLOWER.stemY - 1, color);
				PS.color(FLOWER.stemX - 1, FLOWER.stemY - 1, color);
				PS.color(FLOWER.stemX - 1, FLOWER.stemY - 2, color);
				PS.color(FLOWER.stemX + 1, FLOWER.stemY - 1, color);
				PS.color(FLOWER.stemX + 1, FLOWER.stemY - 2, color);
				PS.audioPlay("fx_tweet");
				FLOWER.isGrowing = false;
				break;
			case 2: // bulb
				PS.color(FLOWER.stemX, FLOWER.stemY, color);
				PS.color(FLOWER.stemX, FLOWER.stemY - 1, color);
				PS.color(FLOWER.stemX - 1, FLOWER.stemY - 1, color);
				PS.color(FLOWER.stemX - 1, FLOWER.stemY, color);
				PS.color(FLOWER.stemX + 1, FLOWER.stemY - 1, color);
				PS.color(FLOWER.stemX + 1, FLOWER.stemY, color);
				PS.color(FLOWER.stemX, FLOWER.stemY - 2, color);
				PS.color(FLOWER.stemX, FLOWER.stemY + 1, color);
				PS.audioPlay("fx_tweet");
				FLOWER.isGrowing = false;
				break;
		}
	}
};

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/
PS.init = function(system, options) {
	// set size of grid
	PS.gridSize(FLOWER.GRID_HEIGHT, FLOWER.GRID_WIDTH);

	// no borders
	PS.border(PS.ALL, PS.ALL, 0);

	// Title
	PS.statusText("Garden");

	// Add any other initialization code you need here.
	PS.color(PS.ALL, PS.ALL, FLOWER.BG_COLOR);
	PS.color(PS.ALL, FLOWER.GRID_HEIGHT - 1, FLOWER.STEM_COLOR);

	// initialize audio
	PS.audioLoad("fx_squirp", {lock : true});
	PS.audioLoad("fx_tweet", {lock : true});
	PS.audioLoad("fx_click", {lock : true});

	PS.timerStart(FLOWER.FRAME_RATE, FLOWER.tick);
};

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/
PS.touch = function(x, y, data, options) {
	// on click
	if (x > 0 && x < FLOWER.GRID_WIDTH - 1 && y > 1 && y < FLOWER.GRID_HEIGHT - 1) {
		PS.audioPlay("fx_squirp");
		FLOWER.isGrowing = true;
		FLOWER.stemX = x;
		FLOWER.stemY = y;
		FLOWER.x = FLOWER.stemX;
		FLOWER.y = FLOWER.BOTTOM_ROW;
	}
	else
		PS.audioPlay("fx_click");
};