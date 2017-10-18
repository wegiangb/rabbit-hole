import IteratorResult from "iterator-result";
import { WorldOctantWrapper } from "./WorldOctantWrapper.js";

/**
 * A world octant iterator.
 *
 * @implements {Iterator}
 * @implements {Iterable}
 */

export class WorldOctantIterator {

	/**
	 * Constructs a new octant iterator.
	 *
	 * @param {WorldOctree} world - An octree.
	 * @param {Number} [lod=0] - The LOD grid to consider.
	 */

	constructor(world, lod = 0) {

		/**
		 * The octree.
		 *
		 * @type {WorldOctree}
		 * @private
		 */

		this.world = world;

		/**
		 * The LOD index.
		 *
		 * @type {Number}
		 * @private
		 * @default 0
		 */

		this.lod = lod;

		/**
		 * The size of the cells in the specified LOD grid.
		 *
		 * @type {Number}
		 * @private
		 */

		this.cellSize = 0;

		/**
		 * The internal octant iterator.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.iterator = null;

		/**
		 * A world octant wrapper.
		 *
		 * @type {WorldOctantWrapper}
		 * @private
		 */

		this.octantWrapper = new WorldOctantWrapper();

		/**
		 * An iterator result.
		 *
		 * @type {IteratorResult}
		 * @private
		 */

		this.result = new IteratorResult();

		this.reset();

	}

	/**
	 * Resets this iterator.
	 *
	 * @return {KeyIterator} This iterator.
	 */

	reset() {

		const lod = this.lod;
		const world = this.world;
		const grid = world.getGrid(lod);

		if(grid !== undefined) {

			this.cellSize = world.getCellSize(lod);
			this.iterator = grid.entries();
			this.result.reset();

		} else {

			console.error("Invalid LOD", lod);

		}

		return this;

	}

	/**
	 * Iterates over the octants.
	 *
	 * @return {IteratorResult} The next key.
	 */

	next() {

		const result = this.result;
		const octantWrapper = this.octantWrapper;
		const internalResult = this.iterator.next();
		const value = internalResult.value;

		if(!internalResult.done) {

			this.keyDesign.unpackKey(value[0], octantWrapper.min);
			octantWrapper.min.multiplyScalar(this.cellSize);
			octantWrapper.min.add(this.world.min);
			octantWrapper.max.copy(octantWrapper.min).addScalar(this.cellSize);
			octantWrapper.octant = value[1];

			result.value = octantWrapper;

		} else {

			result.value = null;
			result.done = true;

		}

		return result;

	}

	/**
	 * Called when this iterator will no longer be run to completion.
	 *
	 * @param {Object} value - An interator result value.
	 * @return {IteratorResult} - A premature completion result.
	 */

	return(value) {

		this.result.value = value;
		this.result.done = true;

		return this.result;

	}

	/**
	 * Returns this iterator.
	 *
	 * @return {WorldOctantIterator} An iterator.
	 */

	[Symbol.iterator]() {

		return this;

	}

}
