const Player = require('./player.js');
const PubSub = require('../helpers/pub_sub.js');

const Game = function (boardView, playerView) {
  this.currentPlayer = null;
  this.currentPlayerID = 1;
  this.board = boardView;
  this.playerView = playerView;
  this.players = [];
};

Game.prototype.bindEvents = function () {
  PubSub.subscribe('IntroForm:player-details-entered', (event) => {
    this.playerView.bindEvents();
    const playerObject = event.detail;
    this.currentPlayer = {id: 1, name: playerObject[1]}
    for (playerID in playerObject){
      const newPlayer = new Player(playerID, playerObject[playerID]);
      newPlayer.bindEvents();
      this.players.push({id: playerID, name: playerObject[playerID]})
    }
    this.board.setStartingPositions(this.players.length);
    this.nextMove();
  })

  PubSub.subscribe('Question:question-result', (evt) => {
    const answerCorrect = evt.detail.answerCorrect;
    // console.log(answerCorrect);
    if (!answerCorrect) {this.passTurn()};
    this.nextMove();
  });
};

Game.prototype.passTurn = function () {
  const turnMechanics = {
    2: {1: 2, 2: 1 },
    3: {1: 2, 2: 3, 3: 1 },
    4: {1: 2, 2: 3, 3: 4, 4: 1 },
  };

  const turnOrder = turnMechanics[this.players.length]
  this.currentPlayerID = turnOrder[this.currentPlayer.id];
  this.currentPlayer = this.players[this.currentPlayerID-1];
};

Game.prototype.nextMove = function () {
  PubSub.publish('Game:current-player', this.currentPlayer);
};

module.exports = Game;
