var thinker = (function(){
  my = {};

  my.a;
  my.s;
  my.w = []
  my.gamma;
  my.eta;

  my.step = function(){
    if(my.a === undefined){
      my.a = states.getCurrentState().snake.direction;
      my.s = states.getCurrentState();
      my.w = Array(1,1,1,-1);
      my.gamma = 0.2;
      my.eta = 0.1;
      my.random = 0.1
    }

    var sPrimed = states.getCurrentState().getNextState(my.a)
    var aPrimed = my.selectA()
    var reward = 0;
    if(sPrimed.snake.position.length > states.getCurrentState().snake.position.length){
      reward = 10;
    }

    var delta = reward //states.getCurrentState().snake.position.length
                + my.gamma * my.findQ(sPrimed, aPrimed)
                - my.findQ(sPrimed, my.a);

    my.w[0] = my.w[0] + my.eta * delta;
    my.w[1] = my.w[1] + my.eta * delta * my.f1(my.s, my.a);
    my.w[2] = my.w[2] + my.eta * delta * my.f2(my.s, my.a);
    my.w[3] = my.w[3] + my.eta * delta * my.f2(my.s, my.a);

    my.s = sPrimed;
    my.a = aPrimed

    states.setCurrentState(my.s);

  }

  my.selectA = function(){
    var as = [[0,1],[1,0],[0,-1],[-1,0]],
        qs = [],
        maxq = -10000,
        maxqi = 0;

    if(Math.random() < my.random){
      var i = 0
      while (!states.getCurrentState().getNextState(as[i]).snake.stillAlive()) {
        i = Math.ceil(4*Math.random())
      }
      return as[i];
      //return as[(as.indexOf(my.a) + Math.ceil(2 - Math.random()))%3]
    }

    for (var i = 0; i < 4; i++) {
      qs[i] = my.findQ(states.getCurrentState().getNextState(as[i]), as[i])
      if(qs[i] >= maxq){
        maxq = qs[i]
        maxqi = i
      }
    }
    ///FIXME: it always chooses the max, yet somehow the max sometimes kills it
    ////and it sometimes dies insantaneously!

    
    //if(qs[0] + qs[1] + qs[2] + qs[3] != 0 ){
    //  console.log(qs[0], qs[1], qs[2], qs[3],"max: ",maxq)
    //  console.log(as[maxqi], states.getCurrentState().getNextState(as[i]).snake.stillAlive());
    //}

    //OWN HEAD EAING PREVENTION
    //if(areOpposites(my.a,as[maxqi])){
    //  var i = 0;
    //  while (!states.getCurrentState().getNextState(as[i]).snake.stillAlive()) {
    //    i = Math.ceil(4*Math.random())
    //  }
    //  return as[i]
    //}

    // SUICIDE ALERT
    // if(!states.getCurrentState().getNextState(as[maxqi]).snake.stillAlive()){
    //   //alert("asdfdf")
    // }
    return as[maxqi];
  }

  my.findQ = function(s,a){
    //return my.w[3] * my.f3(s,a)//my.w[1] * my.f1(s,a) + my.w[2] * my.f2(s,a);
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
