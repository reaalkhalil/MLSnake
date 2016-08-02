var thinker = (function(){
  my = {};
  my.a;
  my.s;
  my.w = []
  my.gamma;
  my.eta;

  my.init = function(){
    my.a = states.getCurrentState().snake.direction;
    my.s = states.getCurrentState();
    my.w = Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    my.gamma = 1;
    my.eta = 0.1;
    my.random = 0.03
  }

  my.maxScore = 0;

  my.step = function(){
    var sPrimed = my.s.getNextState(my.a)
    var aPrimed = my.selectA()
    var reward = 0;
    var newSnakeLength = sPrimed.snake.position.length
    if(newSnakeLength > my.s.snake.position.length){
      reward = 1;
    }else{ // negative reward for dying
      reward = newSnakeLength - my.s.snake.position.length
    }
    if(newSnakeLength > my.maxScore){my.maxScore = newSnakeLength}
    var delta = reward
                + my.gamma * my.findQ(sPrimed, aPrimed)
                - my.findQ(my.s, my.a);

    var feat = my.features(my.s, my.a);
    for(var i = 0; i < feat.length; i++){
      my.w[i] = my.w[i] + my.eta * delta * sigmoid(feat[i]);
    }

    my.s = states.setCurrentState(sPrimed);
    my.a = aPrimed
  }

  my.selectA = function(){
    var as = [[0,1],[1,0],[0,-1],[-1,0]],
        qs = [],
        maxq = -10000,
        maxqi = 0;

    if(Math.random() < my.random){
      var i = 0
      while (!states.getCurrentState().getNextState(as[i]).snake.stillAlive()) {
        i = Math.ceil(3*Math.random())
      }
      return as[i];
    }

    for (var i = 0; i < 4; i++) {
      if(areOpposites(my.a,as[i])){continue;}//not allowed to move backwards
      qs[i] = my.findQ(states.getCurrentState().getNextState(as[i]), as[i])
      if(qs[i] >= maxq){
        maxq = qs[i]
        maxqi = i
      }
    }
    //try to randomise if more than one a maximises q
    return as[maxqi];
  }

  my.findQ = function(s, a){
    var feat = my.features(s, a);
    var q = 0;
    for(var i = 0; i < feat.length; i++){
      q += my.w[i] * sigmoid(feat[i]);
    }
    return q;
  }

  my.features = function(s, a){
    var featureArray = [1];
    var wallFeatures = my.wallFeatures(s, a);
    var appleFeature = my.appleFeature(s, a);
    var snakeFeatures = my.snakeFeatures(s, a);
    featureArray = featureArray.concat(wallFeatures).concat(appleFeature).concat(snakeFeatures);
    return featureArray;
  }
  my.appleFeature = function(s, a){
    var k = subtract([0,0], absVector(subtract(add(s.snake.position[0],a),s.apple.position)));
    return [k[0],k[1]]
  }
  my.wallFeatures = function(s,a){
    var newPos = s.getNextState(a).snake.position
    var head = newPos[0];
    var ar = new Array(head[0] + 1, 60 - head[0], head[1] + 1, 60 - head[1])
    ar.push()
    return ar;
  }

  my.snakeFeatures = function(s,a){
    var newPos = s.getNextState(a).snake.position
    var head = newPos[0];
    var ar = []
    for (var i = 1; i < newPos.length; i++) {
      var a = (dist(head,newPos[i])>0)?1:0
      ar.push(a)
    }
    return ar
  }

  my.getW = function(){
    var newW = new Array();
    for(var i = 0; i < my.w.length; i++){
      newW.push(my.w[i])
    }
    return newW
  }

  return my;
})();
