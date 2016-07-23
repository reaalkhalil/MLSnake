var snake = (function(b){
  this.newPiece = false;
  this.position = new Array();

  this.direction = [0,1];

  this.setDirection  = function(a){
    this.direction = new Array(a[0],a[1]);
  }
  this.getDirection  = function(){
    return new Array(this.direction[0], this.direction[1]);
  }

  this.setPosition = function(a){
    this.position = JSON.parse(JSON.stringify(a));
  }
  this.stillAlive = function(){
    var head = this.position[0]
    for (var i = 1; i < this.position.length; i++) {
      if(this.position[i][0] == head[0] && this.position[i][1] == head[1]){
        return false;
      }
    }
    if(head[0] < 0 || head[1] < 0 || head[0] > 39 || head[1] > 59){
      return false;
    }
    return true;
  }

  this.setPosition(b);
});

var apple = (function(i,j){
  if(i == parseInt(i) && j == parseInt(j)){
    this.position = new Array(i,j);
  }else if(Array.isArray(i) && j === undefined){
    this.position = new Array(i[0],i[1]);
  }
  if(i === undefined && j === undefined){
    this.position = new Array(Math.floor(39*Math.random()),Math.floor(59*Math.random()))
  }

});
