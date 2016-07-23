var mySnake = new snake([[20,5],[20,4],[20,3]]);
var myApple = new apple(24,26)

var myState = new state(mySnake, myApple)
var timeint = 100;

states.setCurrentState(myState);
thinker.init()
timeee = setTimeout("moving()",timeint);

function moving(){
  thinker.step()
  states.plotCurrentState();
  timeee = setTimeout("moving()",timeint);
}
