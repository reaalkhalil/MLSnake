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
    my.w = Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
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
      reward = 5;
    }
    if(newSnakeLength > my.maxScore){my.maxScore = newSnakeLength}
    var delta = reward
                + my.gamma * my.findQ(sPrimed, aPrimed)
                - my.findQ(my.s, my.a);

    var feat = my.features(my.s, my.a);
    for(var i = 0; i < feat.length; i++){
      //if(my.w[i] != Number(my.w[i])){my.w[i] = 0;}
      my.w[i] = my.w[i] + my.eta * delta * sigmoid(feat[i]);
    }

    my.s = states.setCurrentState(sPrimed);
    //so it doesnt die twice in a row
    if(JSON.stringify(sPrimed) == JSON.stringify(my.s)){
      my.a = aPrimed
    }else{
      my.a = [0,1];
    }
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
      //return as[(as.indexOf(my.a) + Math.ceil(2 - Math.random()))%3]
    }

    for (var i = 0; i < 4; i++) {
      if(areOpposites(my.a,as[i])){continue;}//not allowed to move backwards
      qs[i] = my.findQ(states.getCurrentState().getNextState(as[i]), as[i])
      if(qs[i] >= maxq){//randomise if more than one max
        maxq = qs[i]
        maxqi = i
      }
    }
    ///FIXME: it always chooses the max, yet somehow the max sometimes kills it
    ////and it sometimes dies insantaneously! temporary fix in line 62
    return as[maxqi];
  }

  my.findQ = function(s, a){
    var feat = my.features(s, a);
    var q = 0;
  //  console.log(my.w);
    for(var i = 0; i < feat.length; i++){
      q += my.w[i] * sigmoid(feat[i]);
    }
    return q;
  }

  my.features = function(s, a){
    var featureArray = [1];
    var wallFeatures = my.wallFeatures(s, a);
    var appleFeature = subtract([0,0], absVector(subtract(add(s.snake.position[0],a),s.apple.position)));
    //var appleFeature = my.appleFeature(s, a);
    var snakeFeatures = my.snakeFeatures(s, a);
    featureArray = featureArray.concat(wallFeatures).concat(appleFeature).concat(snakeFeatures);
    return featureArray;
  }
  /*my.appleFeature = function(s, a){
    var j = (dist(add(s.snake.position[0],a),s.apple.position) == 0)?1:0
    var i = dist(add(s.snake.position[0],a),s.apple.position) < dist(s.snake.position[0],s.apple.position)?1:0
    return [i,j]
  }*/
  my.wallFeatures = function(s,a){
    var newPos = s.getNextState(a).snake.position
    var head = newPos[0];
    var ar = new Array(head[0] - 0, 59 - head[0], head[1] - 0, 59 - head[1])
    ar.push()
    var maxPos = [59,0,59,0];
    for (var i = 0; i < newPos.length; i++) {
      var piece = add(new Array(newPos[i][0],newPos[i][1]), a);
      maxPos[0] = Math.min(maxPos[0], piece[0] - 0);
      maxPos[1] = Math.min(maxPos[1], 59 - piece[0]);
      maxPos[2] = Math.min(maxPos[2], piece[1] - 0);
      maxPos[3] = Math.min(maxPos[3], 59 - piece[1]);
    }
    ar = ar.concat(maxPos);
    return ar;
  }

  my.snakeFeatures = function(s,a){
    var newPos = s.getNextState(a).snake.position
    var head = newPos[0];
    var ar = new Array(head[0], head[1])
    for (var i = 1; i < newPos.length; i++) {
      ar = ar.concat(absVector(subtract(head,newPos[i])))
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
//////////////http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
