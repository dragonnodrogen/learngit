var model = {
  boardSize:7,
  numShips:3,
  shipLength:3,
  shipsSunk:0,
  ships: [
  {locations:[0, 0, 0], hits:['', '', '']},
  {locations:[0, 0, 0], hits:['', '', '']},
  {locations:[0, 0, 0], hits:['', '', '']}
  ],
  fire:function(guess){  //开火
    for(var i = 0; i < this.numShips; i++){
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0){  //检查是否击中
        ship.hits[index] = 'hit';
        view.displayHit(guess);
        if(this.isSunk(ship)){  //检查是否击沉
          view.displayMessage('holy shit你击沉了我的zj!')
          this.shipsSunk++;
          return true;
        }else if(ship.hits[index] === 'hit'){   //显示击中提示
          view.displayMessage('oh good你打中了我的zj!');
          return true;
        }
      }
    }
    view.displayMiss(guess);
    view.displayMessage('小样你没打中');
    return false;
  },
  isSunk:function(ship){   //击沉方法
    for(var i = 0; i < this.shipLength; i++){
      if(ship.hits[i] !== 'hit'){
        return false;
      }
    }
    return true;
  },
  generateShipLocations:function(){   //战舰位置生成方法
    var locations;
    for(var i = 0; i < this.numShips; i++){
      do{
        locations = this.generateShip();
      } while(this.collision(locations));
      this.ships[i].locations = locations;
    }
    console.log("Ships array: ");
		console.log(this.ships);
  },
  generateShip:function(){
    var direction = Math.floor(Math.random() * 2);
    var row, col;
   
    if(direction === 1){
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
    }else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for(var i = 0; i < this.shipLength; i++){
        if(direction === 1){
          newShipLocations.push(row + '' + (col + i));
      }else{
          newShipLocations.push((row + i) + '' + col);
      }
    }
    return newShipLocations;
  },
  collision:function(locations){
    for (var i = 0; i < this.numShips; i++){
      var ship = this.ships[i];
      for(var j = 0; j < locations.length; j++){
        if(ship.locations.indexOf(locations[j]) >= 0){
          return true;
        }
      }
    }
    return false;
  }
}


var view = {
  displayMessage:function(msg){
    var messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = msg;
  },
  displayHit:function(location){
    var cell = document.getElementById(location);
    cell.setAttribute('class', 'hit');
  },
  displayMiss:function(location){
    var cell = document.getElementById(location);
    cell.setAttribute('class', 'miss');
  }
}
var controller = {
  guesses: 0,
  processGuess:function(guess){
    var location = parseGuess(guess);
    if(location){
      this.guesses++;
      var hit = model.fire(location);
      if(hit && model.shipsSunk === model.numShips){
        view.displayMessage("oh my god你击沉了我所有的zj 猜了" + this.guesses + "次");
      }
    }
  }
}
function parseGuess(guess){
  var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  if (guess === null || guess.length !== 2){
    alert('请输入一个有效的阈值');
  }else{
    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)){
      alert("你输入的不在面板上");
    }else if(row < 0 || row >= model.boardSize ||column < 0 || column >= model.boardSize){
      alert("Oops , that's off the board!");
    }else{
      return row + column;
    }
  }
  return null;
}

function handleFireButton(){
  var guessInput = document.getElementById('guessInput');
  var guess = guessInput.value.toUpperCase();
  controller.processGuess(guess);
  guessInput.value = '';
}
function handleKeyPress(e){
  var fireButton = document.getElementById('fireButton');
  if (e.keyCode === 13){
    fireButton.click();
    return false;
  }
}
window.onload = init;


function init(){
  var fireButton = document.getElementById('fireButton');
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById('guessInput');
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations();
}