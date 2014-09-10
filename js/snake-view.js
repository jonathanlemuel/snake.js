(function () {
  if (typeof SG === "undefined") {
    window.SG = {};
  }

  var View = SG.View = function ($el) {
    this.$el = $el;

    this.board = null;
    this.intervalId = null;
  }

  View.KEYS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W"
  };

  View.STEP_MILLIS = 100;

  View.prototype.handleKeyEvent = function (event) {
    if (View.KEYS[event.keyCode]) {
      this.board.snake.turn(View.KEYS[event.keyCode]);
    } else {
      // some other key was pressed; ignore.
    }
  };

  View.prototype.render = function () {
    // simple text based rendering
    // this.$el.html(this.board.render());

    var view = this;
    var board = view.board;

    var cellsMatrix = buildCellsMatrix();
    board.snake.segments.forEach(function (seg) {
      cellsMatrix[seg.i][seg.j].addClass("snake");
    });

    cellsMatrix[board.apple.position.i][board.apple.position.j].addClass("apple");

    this.$el.empty();
    cellsMatrix.forEach(function (row) {
      var $rowEl = $('<div class="row"></div>');
      row.forEach(function ($cell) { $rowEl.append($cell) });
      view.$el.append($rowEl);
    });

    // sometimes we put helper functions down at the bottom.
    function buildCellsMatrix () {
      var cellsMatrix = [];
      for (var i = 0; i < board.dim; i++) {
        var cellsRow = [];
        for (var j = 0; j < board.dim; j++) {
          cellsRow.push($('<div class="cell"></div>'));
        }
        cellsMatrix.push(cellsRow);
      }

      return cellsMatrix;
    }
  };

  View.prototype.step = function () {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      alert("You lose!");
      window.clearInterval(this.intervalId);
    }
  };

  View.prototype.start = function () {
    this.board = new SG.Board(20);

    $(window).on("keydown", this.handleKeyEvent.bind(this));

    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.STEP_MILLIS
    );
  };
})();
