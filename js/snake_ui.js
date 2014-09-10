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
    if (_(View.KEYS).has(event.keyCode)) {
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

    function buildCellsMatrix () {
      return _.times(board.dim, function () {
        return _.times(board.dim, function () {
          return $('<div class="cell"></div>');
        });
      });
    }

    var cellsMatrix = buildCellsMatrix();
    _(board.snake.segments).each(function (seg) {
      cellsMatrix[seg.i][seg.j].addClass("snake");
    });

    cellsMatrix[board.apple.position.i][board.apple.position.j].addClass("apple");

    this.$el.empty();
    _(cellsMatrix).each(function (row) {
      var $rowEl = $('<div class="row"></div>');
      _(row).each(function ($cell) { $rowEl.append($cell) });
      view.$el.append($rowEl);
    });
  };

  View.prototype.step = function () {
    if (_(this.board.snake.segments).last()) {
      this.board.snake.move();
      this.render();
    } else {
      alert("You lose!");
      window.clearInterval(this.intervalId);
    }
  };

  View.prototype.start = function () {
    this.board = new SG.Board(20);

    $(window).keydown(this.handleKeyEvent.bind(this));

    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.STEP_MILLIS
    );
  };
})();
