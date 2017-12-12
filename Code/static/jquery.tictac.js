(function($) {
  $.fn.tictac = function() {

    return this.each(function() {
      var possibleWins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      var CORNER_SQUARES = [0, 2, 6, 8];
      var SIDE_SQUARES = [1, 3, 5, 7];
      var CENTER_SQUARE = 4;
      var board = $(this);
      var squares = board.find("td");
      var X = "X";
      var O = "O";
	  var timerVar = setInterval(boardRefresh, 2000);
	  
	  function boardRefresh(){
		  $.get("http://localhost:5000/game/currentStatus",function(data, status){
				var msg = data.split(":");
				var plyr = msg[0];
				var sts = JSON.parse(msg[1]);
				var winner = msg[2];
				setBoardStatus(board,sts);
				var myplayer = $("h1").text();
				if (plyr === myplayer)
				{
					$("p").text("Your turn!");
				}
				else
				{
					$("p").text("Opponent's turn!");
				}
				
				if (winner === "")
				{}
				else
				{
					clearInterval(boardRefresh);
					if (winner === myplayer)
						$("p").text("You Won!");
					else
					{
						$("p").text("You Lose!");
					}
					squares.unbind("click");
				}
				
				});
	  };

	  var getBoardStatus = function(board) {
        // get the indexes of all available squares for supplied board
        var allSquares = board.find("td");
        var emptySquares = board.find("td:empty");
        var boardIndexes = [];
        for(var i = 0; i < allSquares.length; i++) {
			if(allSquares[i].textContent === "X")
				boardIndexes.push(1);
			else if(allSquares[i].textContent === "O")
				boardIndexes.push(2);
			else
				boardIndexes.push(0);
        }
        return boardIndexes;
      };
	  
	  var setBoardStatus = function(board,currentstatus) {
        var allSquares = board.find("td");
        for(var i = 0; i < currentstatus.length; i++) {
			if (currentstatus[i] == 1)
			{
				allSquares[i].textContent = X;
			}
			else if (currentstatus[i] == 2)
			{
				allSquares[i].textContent = O;
			}
        }
        return 0;
      };
	  
	  $("#btn1").click(function(){
		  boardRefresh();
	  });

      squares.click(function() {
        var square = $(this);
        var squareIndex = squares.index(square);
        var played = false;
        var myplayer = $("h1").text();
		
        // fill in the square if it's open
        if(square.text() === "") {
			if (myplayer === "player1")
			{
				square.text(X);
			}
			else if (myplayer === "player2")
			{
				square.text(O);
			}

			$.get("http://localhost:5000/play/"+myplayer+"/"+JSON.stringify(getBoardStatus(board)),function(data, status){
					//alert("Data: " + data + "\nStatus: " + status);
					if (status === "success")
					{
						//if not valid move
						if (data === "False")
						{
							square.text("");
						}
						else
						{
							$("p").text("Opponent's turn!");
						}
					}
					else
					{
						square.text("");
					}
				});

        } 
		else 
		{
          return;
        }

      });
    });
  };
})(jQuery);
