var thinker = (function(){
  my = {};
  my.w = [];

  my.init = function(){
    my.a = states.getCurrentState().snake.direction;
    my.s = states.getCurrentState();
    my.w = Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
	my.lastLength = 0;
    my.gamma = 1; // discount factor
    my.eta = 0.05; // learning rate
    my.random = 0.0001; // exploration
    my.lambda = 0.1; // regularisation
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
	  reward = -0.5;
	  console.log(my.lastLength);
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
    var appleFeatures = my.appleFeatures(s, a);
    var snakeFeatures = my.snakeFeatures(s, a);
    var mixedFeatures = my.mixedFeatures(s, a);
	//var compressionFeature = my.compressionFeature(s, a);
    featureArray = featureArray.concat(wallFeatures).concat(appleFeatures).concat(snakeFeatures).concat(mixedFeatures);
    return featureArray;
  };

  my.appleFeatures = function(s, a){
    var newPos = s.getNextState(a).snake.position;
    var head = newPos[0];
    var apple = s.apple.position;
    var k = new Array(-1*Math.abs(head[0] - apple[0])/10, -1*Math.abs(head[1] - apple[1])/10);
	k[0] = (k[0]===0)?10:k[0];
	k[1] = (k[1]===0)?10:k[1];
    return k;
  };

  my.wallFeatures = function(s,a){
    var newPos = s.getNextState(a).snake.position;
    var head = newPos[0];
    var k = new Array((head[0]<0)?0:10, (head[0]>59)?0:10, (head[1]<0)?0:10, (head[1]>59)?0:10);
    return k;
  };

  my.snakeFeatures = function(s,a){
    var newPos = s.getNextState(a).snake.position;
    var head = newPos[0];
    var k = 1;
    for (var i = 1; i < newPos.length; i++) {
	  k *= (dist(head,newPos[i])>0)?10:0;
    }
    return [k];
  };

  my.mixedFeatures = function(s, a){
	var snake = my.snakeFeatures(s, a)[0];
	if(snake !== 0){
	  snake = 0;
	}else{
	  snake = 10;
	}
	var wall = my.wallFeatures(s, a);
	var apple = my.appleFeatures(s, a);
	var mixed1 = new Array(apple[0]*wall[0]*wall[1]/10, apple[1]*wall[2]*wall[3]/10);
	return mixed1;
  };

  my.compressionFeature = function(s,a){
    var newPos = s.getNextState(a).snake.position;
	var avgNextTo = 0.0;
    for (var i = 1; i < newPos.length-1; i++) {
      var nextToIt = 0.0;
      for (var j = 0; j < newPos.length; j++) {
        if(newPos[i][0] == newPos[j][0] && Math.abs(newPos[i][1] - newPos[j][1]) == 1){
		  nextToIt++;
		} else if(newPos[i][1] == newPos[j][1] && Math.abs(newPos[i][0] - newPos[j][0]) == 1){
		  nextToIt++;
		}
	  }
	  avgNextTo += nextToIt / (newPos.length - 2);
	}
	return [(avgNextTo-2)/10];
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
