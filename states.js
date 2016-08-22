var state = (function(s,a){
  var ss,aa;
  if(s instanceof state){
    ss = s.snake;
    aa = s.apple;
  }else{ss=s;aa=a;}
  if(ss instanceof snake && aa instanceof apple){
    var newApple = new apple(aa.position);
    var newSnake = new snake(ss.position);
    newSnake.setDirection(ss.getDirection());
    this.snake = newSnake;
    this.apple = newApple;
  }


  this.getNextState = function(d){
    if(d === undefined){
      d = this.snake.direction;
    }
    var newApple = new apple(this.apple.position);
    var newSnake = new snake(this.snake.position);
    newSnake.newPiece = this.snake.newPiece;
    newSnake.position.unshift(add(newSnake.position[0],d));

    if(newSnake.position[0][0] == newApple.position[0] && newSnake.position[0][1] == newApple.position[1] ){
      newApple = new apple();
      newSnake.newPiece = true;
    }

    if(!newSnake.newPiece){
      newSnake.position.pop();
    }else{
      newSnake.newPiece = false;
    }


    //if(newSnake.stillAlive()){
      return new state(newSnake,newApple);
    //}
    //console.log("snake died");
    //return false
  };
});

var states = (function(){
  my = {};

  my.stateList = [];

  my.setCurrentState = function (i){
    if(i == parseInt(i)){
      my.currentState = new state(my.stateList[i]);
    }else if(i instanceof state){
      my.currentState = new state(i);
    }

    if(!my.currentState.snake.stillAlive()){
      var mySnake = new snake([[20,5],[20,4],[20,3]]);
      var myApple = new apple();

      var myState = new state(mySnake, myApple);
      my.currentState = myState;
    }
    var newState = new state(my.currentState);
    return newState;
  };

  my.getCurrentState = function(){
    var newState = new state(my.currentState);
    return newState;
  };


  my.plotCurrentState = function (){
    clearStage();
    document.getElementById("dot" + String(my.currentState.apple.position[0] + 10)  + String(my.currentState.apple.position[1] + 10))
    .style.backgroundColor="#ff3399";

    for (var i = 0; i < my.currentState.snake.position.length; i++) {
      document.getElementById("dot" + String(my.currentState.snake.position[i][0] + 10) + String(my.currentState.snake.position[i][1] + 10))
    .style.backgroundColor="#33ff99";
    }
  };

  return my;
})();
