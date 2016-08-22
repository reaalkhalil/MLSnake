var fs = require('fs');
eval(fs.readFileSync('math.js')+'');
eval(fs.readFileSync('snake.js')+'');
eval(fs.readFileSync('states.js')+'');
eval(fs.readFileSync('thinker.js')+'');

var mySnake = new snake([[20,5],[20,4],[20,3]]);
var myApple = new apple(24,26);

var myState = new state(mySnake, myApple);

states.setCurrentState(myState);
thinker.init();

var run = 0;
function moving(){
  thinker.step();
  if(run%10000 === 0){
    // console.log(thinker.maxScore);
    //console.log(thinker.getW());
  }
  run++;
}

while(true){
  moving();
}
