var thinker = (function(){
  my = {};
  my.w = [];

  my.init = function(){
    my.a = states.getCurrentState().snake.direction;
    my.s = states.getCurrentState();
    my.w = Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
	my.lastLength = 0;
    my.gamma = 1; // discount factor
    my.eta = 0.1; // learning rate
    my.random = 0; // exploration
    my.lambda = 0.2; // regularisation
  };

  my.maxScore = 0;

  my.step = function(){
    var sPrimed = my.s.getNextState(my.a);
    var aPrimed = my.selectA();
    var reward = 0;
    var newSnakeLength = sPrimed.snake.position.length;
	var lengthDiff = 0;

    lengthDiff = newSnakeLength - my.lastLength;

    if(lengthDiff > 0){
      reward = 1;
    }
	
	if(lengthDiff < 0){
	  console.log(my.lastLength);
    }

    if(newSnakeLength > my.maxScore){
      my.maxScore = newSnakeLength;
	  console.log('new max score: ' + newSnakeLength + ' weights are: ');
	  console.log(my.getW());
	}
    var delta = reward +
      my.gamma * my.findQ(sPrimed, aPrimed) -
      my.findQ(my.s, my.a);

    var feat = my.features(my.s, my.a);
    for(var i = 0; i < feat.length; i++){
      my.w[i] = (1 - my.lambda * my.eta / feat.length)*my.w[i] + my.eta * delta * sigmoid(feat[i]);
    }
    my.lastLength = 0 + my.s.snake.position.length;
    my.s = states.setCurrentState(sPrimed);
    my.a = aPrimed;
  };

  my.selectA = function(){
    var as = [[0,1],[1,0],[0,-1],[-1,0]],
        qs = [],
        maxq = -10000,
        maxqk = 0;

    if(Math.random() < my.random){
      var i = 0;
      while (!states.getCurrentState().getNextState(as[i]).snake.stillAlive()) {
        i = Math.ceil(3*Math.random());
      }
      return as[i];
    }

    for (var k = 0; k < 4; k++) {
      if(areOpposites(my.a,as[k])){continue;}//not allowed to move backwards
      qs[k] = my.findQ(states.getCurrentState().getNextState(as[k]), as[k]);
      if(qs[k] >= maxq){
        maxq = qs[k];
        maxqk = k;
      }
    }
    return as[maxqk];
  };

  my.findQ = function(s, a){
    var feat = my.features(s, a);
    var q = 0;
    for(var i = 0; i < feat.length; i++){
      q += my.w[i] * sigmoid(feat[i]);
    }
    return q;
  };

  my.features = function(s, a){
    var featureArray = [1];
    var wallFeatures = my.wallFeatures(s, a);
    var appleFeature = my.appleFeature(s, a);
    var snakeFeatures = my.snakeFeatures(s, a);
    featureArray = featureArray.concat(wallFeatures).concat(appleFeature).concat(snakeFeatures);
    return featureArray;
  };

  my.appleFeature = function(s, a){
    var newPos = s.getNextState(a).snake.position;
    var head = newPos[0];
    var apple = s.apple.position;
    var k = new Array(-1*Math.abs(head[0] - apple[0])/10, -1*Math.abs(head[1] - apple[1])/10);
	k[0] = (k[0]===0)?10:k[0];
	k[1] = (k[1]===0)?10:k[1];
    return [k[0],k[1]];
  };

  my.wallFeatures = function(s,a){
    var newPos = s.getNextState(a).snake.position;
    var head = newPos[0];
    //var ar = new Array(head[0] + 1, 60 - head[0], head[1] + 1, 60 - head[1]);
    var ar = new Array((head[0]<0)?0:10, (head[0]>59)?0:10, (head[1]<0)?0:10, (head[1]>59)?0:10);
    return ar;
  };

  my.snakeFeatures = function(s,a){
    var newPos = s.getNextState(a).snake.position;
    var head = newPos[0];
    var b = 1;
    for (var i = 1; i < newPos.length; i++) {
	  b *= (dist(head,newPos[i])>0)?1:0;
    }
    return [b];
  };

  my.getW = function(){
    var newW = [];
    for(var i = 0; i < my.w.length; i++){
      if(my.w[i]===0){
        break;
	  }
      newW.push(my.w[i]);
    }
    return newW;
  };

  return my;
})();
