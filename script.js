var mySnake = new snake([[20,5],[20,4],[20,3]]);
var myApple = new apple(24,26)

var myState = new state(mySnake, myApple)


states.setCurrentState(myState);
states.plotCurrentState();


thinker.step()
states.plotCurrentState();





var timeint = 100

timeee = setTimeout("moving()",timeint);

function moving(){
  thinker.step()
  states.plotCurrentState();
  timeee = setTimeout("moving()",timeint);
}
