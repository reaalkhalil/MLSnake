var view = (function(){

  my.erase = function (){
    for (var i = 0; i < 60; i++) {
      for (var j = 0; j < 60; j++) {
        if(document.getElementById("dot" + String(i + 10)  + String(j + 10)) === null){
          console.log("dot" + String(i + 10)  + String(j + 10));
        }
        document.getElementById("dot" + String(i + 10)  + String(j + 10))
        .style.backgroundColor="#000000";
      }
    }
  };

  my.plot = function (s){
    my.erase();
    document.getElementById("dot" + String(s.apple.position[0] + 10)  + String(s.apple.position[1] + 10))
    .style.backgroundColor="#ff3399";

    for (var i = 0; i < s.snake.position.length; i++) {
      document.getElementById("dot" + String(s.snake.position[i][0] + 10) + String(s.snake.position[i][1] + 10))
    .style.backgroundColor="#33ff99";
    }
  };

  return my;
})();
