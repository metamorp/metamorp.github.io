function gridplay_onkeydown(evt) {
  switch (evt.keyCode) {
    case 27:
      reset();
      evt.preventDefault();
      return false;
    case 37: // left
      try_move_left(player, enemy);
      evt.preventDefault();
      return false;
    case 38: // up
      try_move_up(player, enemy);
      evt.preventDefault();
      return false;
    case 39: // right
      try_move_right(player, enemy);
      evt.preventDefault();
      return false;
    case 40: // down
      try_move_down(player, enemy);
      evt.preventDefault();
      return false;
  }
}

var shuffleboard = document.getElementById("shuffleboard");
var cols = 7, rows = 7, neutralColor = "#aaa";
var player, enemy;
for (var i=0; i<rows; i++) {
  var row = shuffleboard.insertRow();
  for (var j=0; j<cols; j++) {
    row.insertCell(j);
  }
}
reset();
function reset() {
  var classes = ["zero", "one"];
  for (var i=0; i<rows; i++)
  for (var j=0; j<cols; j++) {
    shuffleboard.rows[i].cells[j].className = classes[(i+j)%2];
    shuffleboard.rows[i].cells[j].style.borderColor = neutralColor;
  }
  var p = document.getElementById("player");
  if (p) {
    p.id = "";
  }
  p = document.getElementById("enemy");
  if (p) {
    p.id = "";
  }
  player = { row: 0, col: 0, name: "player", move: 0, on: "#d30", off: "#555" };
  enemy = { row: rows-1, col: cols-1, name: "enemy", move: 0, on: "#05d", off: "#555" };
  shuffleboard.rows[0].cells[0].style.borderColor = player.on;
  shuffleboard.rows[rows-1].cells[cols-1].style.borderColor = enemy.on;
}
function mod(m, d) {
  return ((m%d)+d)%d;
}
function try_move_left(mover, otherguy) {
    if (otherguy.row != mover.row || otherguy.col != mod(mover.col-1,cols)) {
      var previous = shuffleboard.rows[mover.row].cells[mover.col];
      mover.col = mod(mover.col-1, cols);
      var current = shuffleboard.rows[mover.row].cells[mover.col];
      previous.style.borderColor = neutralColor;
      if (mover.move) {
        current.style.borderColor = mover.on;
        switch (mover.move) {
          case 1: // had moved left
            // swap with initial starting board 
            previous = shuffleboard.rows[mover.row].cells[mod(mover.col+2,cols)];
            break;
          case 2: // had moved up
            // swap boards along diagonal
            previous = shuffleboard.rows[mover.row].cells[mod(mover.col+1,cols)];
            current = shuffleboard.rows[mod(mover.row+1,rows)].cells[mover.col];
            break;
          case 3: // had moved right
            // swap the previous/current as they are
            break;
          case 4: // had moved down
            previous = shuffleboard.rows[mover.row].cells[mod(mover.col+1,cols)];
            current = shuffleboard.rows[mod(mover.row-1,rows)].cells[mover.col];
            break;
        }
        var c = current.className;
        current.className = previous.className;
        previous.className = c;
        mover.move = 0;
      } else {
        current.style.borderColor = mover.off;
        mover.move = 1;
      }
    }
}
function try_move_right(mover, otherguy) {
    if (otherguy.row != mover.row || otherguy.col != mod(mover.col+1,cols)) {
      var previous = shuffleboard.rows[mover.row].cells[mover.col];
      mover.col = mod(mover.col+1, cols);
      var current = shuffleboard.rows[mover.row].cells[mover.col];
      previous.style.borderColor = neutralColor;
      if (mover.move) {
        current.style.borderColor = mover.on;
        switch (mover.move) {
          case 1: // had moved left
            break;
          case 2: // had moved up
            previous = shuffleboard.rows[mover.row].cells[mod(mover.col-1,cols)];
            current = shuffleboard.rows[mod(mover.row+1,rows)].cells[mover.col];
            break;
          case 3: // had moved right
            previous = shuffleboard.rows[mover.row].cells[mod(mover.col-2,cols)];
            break;
          case 4: // had moved down
            previous = shuffleboard.rows[mover.row].cells[mod(mover.col-1,cols)];
            current = shuffleboard.rows[mod(mover.row-1,rows)].cells[mover.col];
            break;
        }
        var c = current.className;
        current.className = previous.className;
        previous.className = c;
        mover.move = 0;
      } else {
        current.style.borderColor = mover.off;
        mover.move = 3;
      }
    }
}
function try_move_up(mover, otherguy) {
    if (otherguy.col != mover.col || otherguy.row != mod(mover.row-1,rows)) {
      var previous = shuffleboard.rows[mover.row].cells[mover.col];
      mover.row = mod(mover.row-1, rows);
      var current = shuffleboard.rows[mover.row].cells[mover.col];
      previous.style.borderColor = neutralColor;
      if (mover.move) {
        current.style.borderColor = mover.on;
        switch (mover.move) {
          case 1: // had moved left
            previous = shuffleboard.rows[mover.row].cells[mod(mover.col+1,cols)];
            current = shuffleboard.rows[mod(mover.row+1,rows)].cells[mover.col];
            break;
          case 2: // had moved up
            previous = shuffleboard.rows[mod(mover.row+2,rows)].cells[mover.col];
            break;
          case 3: // had moved right
            previous = shuffleboard.rows[mover.row].cells[mod(mover.col-1,cols)];
            current = shuffleboard.rows[mod(mover.row+1,rows)].cells[mover.col];
            break;
          case 4: // had moved down
            break;
        }
        var c = current.className;
        current.className = previous.className;
        previous.className = c;
        mover.move = 0;
      } else {
        current.style.borderColor = mover.off;
        mover.move = 2;
      }
    }
}
function try_move_down(mover, otherguy) {
    if (otherguy.col != mover.col || otherguy.row != mod(mover.row+1,rows)) {
      var previous = shuffleboard.rows[mover.row].cells[mover.col];
      mover.row = mod(mover.row+1, rows);
      var current = shuffleboard.rows[mover.row].cells[mover.col];
      previous.style.borderColor = neutralColor;
      if (mover.move) {
        current.style.borderColor = mover.on;
        switch (mover.move) {
          case 1: // had moved left
            previous = shuffleboard.rows[mover.row].cells[mod(mover.col+1,cols)];
            current = shuffleboard.rows[mod(mover.row-1,rows)].cells[mover.col];
            break;
          case 2: // had moved up
            break;
          case 3: // had moved right
            previous = shuffleboard.rows[mover.row].cells[mod(mover.col-1,cols)];
            current = shuffleboard.rows[mod(mover.row-1,rows)].cells[mover.col];
            break;
          case 4: // had moved down
            previous = shuffleboard.rows[mod(mover.row-2,rows)].cells[mover.col];
            break;
        }
        var c = current.className;
        current.className = previous.className;
        previous.className = c;
        mover.move = 0;
      } else {
        current.style.borderColor = mover.off;
        mover.move = 4;
      }
    }
}

setInterval(function() {
  switch ( Math.floor(Math.random()*4) ) {
    case 0: // left
      try_move_left(enemy, player);
      break;
    case 1: // up
      try_move_up(enemy, player);
      break;
    case 2: // right
      try_move_right(enemy, player);
      break;
    case 3: // down
      try_move_down(enemy, player);
      break;
  }
}, 2000); // have enemy move every 2 seconds
