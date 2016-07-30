var mySnake = new snake([[20,5],[20,4],[20,3]]);
var myApple = new apple(24,26)

var myState = new state(mySnake, myApple)
var timeint = 10;

states.setCurrentState(myState);
thinker.init()
moving()
timeee = setTimeout("moving()",timeint);
var run = 0;
function moving(){
  thinker.step()
  states.plotCurrentState();
  timeee = setTimeout("moving()",timeint);
  if(run%1000 == 0){
    console.log(thinker.maxScore);
    console.log(thinker.getW());
  }
  run++
}
