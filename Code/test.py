from flask import Flask
from flask import render_template
from flask import url_for
from flask import session
import ast

app = Flask(__name__)

#global variables####
player1 = ''
player2 = ''
currentPlayer = ''
currentStatus = [0,0,0,0,0,0,0,0,0]
winner = ''
#####################

@app.route("/")
def indexPage():
    global player1
    global player2
    global currentPlayer
    if player1 == '':
        player1 = 'player1'
        currentPlayer = player1
        return game(player1)
    elif player2 == '':
        player2 = 'player2'
        return game(player2)
    else:
        return "Game is already occupied by other. Please wait to get slot. Please refresh the page after some time.\n Thank you.."

@app.route("/game/<player>")
def game(player):
    print url_for('static', filename='game.css')
    print url_for('static', filename='jquery.tictac.js')
    return render_template('game.html',playername=player)


@app.route("/play/<player>/<statusstr>")
def play(player,statusstr):
    global currentPlayer
    global currentStatus
    global winner
    # print player
    # print currentPlayer
    # print statusstr
    #Check if the player is allowed to play now
    if player == currentPlayer:
        #Check validity of the status
        receivedStatus = ast.literal_eval(statusstr)
        statusDiff = [a-b for a,b in zip(currentStatus,receivedStatus)]
        newIdx = 0
        for i in range(len(statusDiff)):
            if statusDiff[i] < 0:
                newIdx = i
                break
        else:
            return str(False)

        # Change the current player to next player and status update
        if player == player1:
            currentPlayer = player2
            currentStatus[newIdx] = 1
        else:
            currentPlayer = player1
            currentStatus[newIdx] = 2

        winner = winCheck(currentStatus)
        return str(True)

    #If the player is not allowed now, return False
    else:
        return str(False)

def winCheck(currentStatus):
    winPtnSet = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    for winPtn in winPtnSet:
        if currentStatus[winPtn[0]] == 1 and currentStatus[winPtn[1]] == 1 and currentStatus[winPtn[2]] == 1:
            return 'player1'
        elif currentStatus[winPtn[0]] == 2 and currentStatus[winPtn[1]] == 2 and currentStatus[winPtn[2]] == 2:
            return 'player2'
        else:
            pass
    else:
        return ''

@app.route("/game/currentStatus")
def getCurrentStatus():
    global winner
    global currentPlayer
    global currentStatus
    return str(currentPlayer)+":"+str(currentStatus)+":"+str(winner)


app.run()