function add(i,j) {
  ///FIXME: sometimes this gets an undefined variable??
  if(i === undefined || j === undefined){
    return new Array(0, 0);
  }
  return new Array(i[0] + j[0], i[1] + j[1]);
}

function subtract(i,j) {
  ///FIXME: sometimes this gets an undefined variable??
  if(i === undefined || j === undefined){
    return new Array(0, 0);
  }
  return new Array(i[0] - j[0], i[1] - j[1]);
}

function absVector(i){
  return new Array(Math.max(i[0],-i[0]), Math.max(i[1],-i[1]));
}


function dist(i,j){
  return Math.sqrt((i[0]-j[0])*(i[0]-j[0]) + (i[1]-j[1])*(i[1]-j[1]))
}
function distsq(i,j){
  return (i[0]-j[0])*(i[0]-j[0]) + (i[1]-j[1])*(i[1]-j[1])
}

function clearStage(){
  for (var i = 0; i < 60; i++) {
    for (var j = 0; j < 60; j++) {
      if(document.getElementById("dot" + String(i + 10)  + String(j + 10)) == null){
        console.log("dot" + String(i + 10)  + String(j + 10));
      }
      document.getElementById("dot" + String(i + 10)  + String(j + 10))
      .style.backgroundColor="#000000";
    }
  }
}

function areOpposites(i,j){
  if (i[0] + j[0] == 0 && i[1] + j[1] ==0){
    return true;
  }
  return false;
}

function sigmoid(i){
  if(i[0] === undefined){
    return 1 / (1 + Math.exp(-i));
  }
}
