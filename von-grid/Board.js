/*
	Interface to the grid. Holds data about the visual representation of the cells (tiles).

	@author Corey Birnbaum https://github.com/vonWolfehaus/
 */
vg.Board = function(grid) {
	if (!grid) throw new Error('You must pass in a grid system for the board to use.');

	this.tiles = [];
	this.tileGroup = null; // only for tiles

	this.group = new THREE.Object3D(); // can hold all entities, also holds tileGroup, never trashed

	this.grid = null;
	this.overlay = null;
	// need to keep a resource cache around, so this Loader does that, use it instead of THREE.ImageUtils
	vg.Loader.init();

	this.setGrid(grid);
};

vg.Board.prototype = {
	addTile: function(tile) {
		var i = this.tiles.indexOf(tile);
		if (i === -1) this.tiles.push(tile);
		else return;

		this.snapTileToGrid(tile);
		tile.position.y = 0;

		this.tileGroup.add(tile.mesh);
		this.grid.add(tile.cell);

		tile.cell.tile = tile;
	},

	removeTile: function(tile) {
		if (!tile) return; // was already removed somewhere
		var i = this.tiles.indexOf(tile);
		this.grid.remove(tile.cell);

		if (i !== -1) this.tiles.splice(i, 1);
		// this.tileGroup.remove(tile.mesh);

		tile.dispose();
	},

	removeAllTiles: function() {
		if (!this.tileGroup) return;
		var tiles = this.tileGroup.children;
		for (var i = 0; i < tiles.length; i++) {
			this.tileGroup.remove(tiles[i]);
		}
	},

	snapTileToGrid: function(tile) {
		if (tile.cell) {
			tile.position.copy(this.grid.cellToPixel(tile.cell));
		}
		else {
			var cell = this.grid.pixelToCell(tile.position);
			tile.position.copy(this.grid.cellToPixel(cell));
		}
		return tile;
	},

	setGrid: function(newGrid) {
		this.group.remove(this.tileGroup);
		if (this.grid && newGrid !== this.grid) {
			this.removeAllTiles();
			this.tiles.forEach(function(t) {
				this.grid.remove(t.cell);
				t.dispose();
			});
			this.grid.dispose();
		}
		this.grid = newGrid;
		this.tiles = [];
		this.tileGroup = new THREE.Object3D();
		this.group.add(this.tileGroup);
	},

	generateTilemap: function() {
		this.reset();

		var tiles = this.grid.generateTiles();
		this.tiles = tiles;

		this.tileGroup = new THREE.Object3D();
		for (var i = 0; i < tiles.length; i++) {
			this.tileGroup.add(tiles[i].mesh);
		}

		this.group.add(this.tileGroup);
	},

	reset: function() {
		// removes all tiles from the scene, but leaves the grid intact
		this.removeAllTiles();
		if (this.tileGroup) this.group.remove(this.tileGroup);
	}
};

vg.Board.prototype.constructor = vg.Board;