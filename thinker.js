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
    my.w = Array(1,100,1,-100);
    my.gamma = 1;
    my.eta = 0.1;
    my.random = 0.01
  }

  my.step = function(){
    var sPrimed = my.s.getNextState(my.a)
    var aPrimed = my.selectA()
    var reward = 0;
    if(sPrimed.snake.position.length > my.s.snake.position.length){
      reward = 5;
    }

    var delta = reward
                + my.gamma * my.findQ(sPrimed, aPrimed)
                - my.findQ(my.s, my.a);

    my.w[0] = my.w[0] + my.eta * delta;
    my.w[1] = my.w[1] + my.eta * delta * my.f1(my.s, my.a);
    my.w[2] = my.w[2] + my.eta * delta * my.f2(my.s, my.a);
    my.w[3] = my.w[3] + my.eta * delta * my.f3(my.s, my.a);


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

  my.findQ = function(s,a){
    // return my.w[3] * my.f3(s,a)
    return my.w[0] + my.w[1] * my.f1(s,a) + my.w[2] * my.f2(s,a) + my.w[3] * my.f3(s,a);
  }


  my.f1 = function(s,a){//eat apple on move?
    if(dist(add(s.snake.position[0],a),s.apple.position) == 0){
        return 1
      }else{
        return 0
      }
  }

  my.f2 = function(s,a){//any closer to apple?
    if(dist(add(s.snake.position[0],a),s.apple.position) < dist(s.snake.position[0],s.apple.position)){
        return 1
      }else{
        return 0
      }
  }

  my.f3 = function(s,a){//dead after moving
    return s.getNextState(a).snake.stillAlive()?0:1;
  }



  my.getW = function(){
    var newW = new Array(my.w[0], my.w[1], my.w[2], my.w[3]);
    return newW
  }

  return my;
})();
