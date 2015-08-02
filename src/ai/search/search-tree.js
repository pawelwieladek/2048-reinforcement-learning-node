var Direction = require("../../game/direction");
var monotonicity = require("./heuristics/monotonicity");
var smoothness = require("./heuristics/smoothness");
var availability = require("./heuristics/availability");
var maximization = require("./heuristics/maximization");

function SearchTree(depth, monotonicityWeight, smoothnessWeight, availabilityWeight, maximizationWeight) {
    this.depth = depth;
    this.monotonicityWeight = monotonicityWeight;
    this.smoothnessWeight = smoothnessWeight;
    this.availabilityWeight = availabilityWeight;
    this.maximizationWeight = maximizationWeight;
}

SearchTree.deserialize = function(serialized) {
    return new SearchTree(serialized.depth, serialized.monotonicityWeight, serialized.smoothnessWeight, serialized.availabilityWeight, serialized.maximizationWeight);
};

SearchTree.OpponentValues = [1, 2];

SearchTree.prototype.evaluate = function(grid) {
    return this.monotonicityWeight * monotonicity(grid) +
        this.smoothnessWeight * smoothness(grid) +
        this.availabilityWeight * availability(grid) +
        this.maximizationWeight * maximization(grid);
};

SearchTree.prototype.search = function(grid) {
    return this.minimax(grid, this.depth, true);
};

SearchTree.prototype.opponentMoves = function(grid) {
    var moves = [];
    for (var i = 0; i < SearchTree.OpponentValues.length; i++) {
        for (var j = 0; j < grid.tiles.length; j++) {
            if (grid.value(j) === 0) {
                var clone = grid.clone();
                clone.add(j, SearchTree.OpponentValues[i]);
                moves.push(clone);
            }
        }
    }
    return moves;
};

SearchTree.prototype.playerMoves = function(grid) {
    var moves = [];
    var directions = Direction.all();
    for (var i = 0; i < directions.length; i++) {
        var clone = grid.clone();
        var points = clone.slide(directions[i]);
        if (points !== null) {
            moves.push({
                direction: directions[i],
                grid: clone
            });
        }
    }
    return moves;
};

SearchTree.prototype.minimax = function(grid, depth, playerTurn) {
    var i, result;
    var bestDirection = null;
    var bestValue;
    if (grid.max() === 11 || depth === 0) {
        return {
            score: this.evaluate(grid),
            direction: bestDirection
        };
    }

    if (playerTurn) {
        bestValue = -Infinity;
        var playerMoves = this.playerMoves(grid);
        for (i = 0; i < playerMoves.length; i++) {
            result = this.minimax(playerMoves[i].grid, depth - 1, !playerTurn);
            if (result.score > bestValue) {
                bestValue = result.score;
                bestDirection = playerMoves[i].direction;
            }
        }
        return {
            score: bestValue,
            direction: bestDirection
        };
    } else {
        bestValue = Infinity;
        var opponentMoves = this.opponentMoves(grid);
        for (i = 0; i < opponentMoves.length; i++) {
            result = this.minimax(opponentMoves[i], depth - 1, !playerTurn);
            if (result.score < bestValue) {
                bestValue = result.score;
            }
        }
        return {
            score: bestValue,
            direction: bestDirection
        };
    }
};

module.exports = SearchTree;