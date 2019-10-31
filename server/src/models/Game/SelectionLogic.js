"use strict";

import SelectedBox from "./SelectedBox";

const Logic = props => {
  const { io, client, games } = props.self;
  const { boxId } = props;

  const [player, game] = getPlayerGame(games, client.id);

  const selectedBox = new SelectedBox({ boxId, player, game });
  // console.log(selectedBox);

  let emit = false;

  if (selectedBox.verification) {
    if (!game.board.history.exist(selectedBox.boxId)) {
      // if we have already one pawns selected
      if (game.board.history.length() > 0) {
        if (selectedBox.typePawns === "empty") {
          const move = game.board.moveBoxes(selectedBox);
          if (move) {
            // Remove active box selection
            io.to(game.room).emit(
              "returnVerificationSelectedBox",
              game.board.history.list[0]
            );

            const newSelectedBox = new SelectedBox({ boxId, player, game });

            // Need to transform to queen
            game.board.verifySwitchQueen(newSelectedBox);

            // Before switch verify
            let switchHand = game.board.verifySwitchHand(
              newSelectedBox,
              selectedBox.win || false
            );

            if (switchHand)
              game.hand = game.players.filter(p => p.id !== player.id)[0].id;

            // CLEAN
            game.board.history.clean();

            io.to(game.room).emit("updateGame", game);
          }
        }
      } else if (selectedBox.typePawns !== "empty") {
        game.board.history.add(selectedBox);
        emit = true;
      }
    } else {
      game.board.history.remove(selectedBox.boxId);
      emit = true;
    }
  }

  if (emit) io.to(game.room).emit("returnVerificationSelectedBox", selectedBox);
};

const getPlayerGame = (games, clientId) => {
  for (const key in games) {
    if (games.hasOwnProperty(key)) {
      const game = games[key];
      for (const kPLayer in game.players) {
        if (game.players.hasOwnProperty(kPLayer)) {
          const player = game.players[kPLayer];
          if (player.id === clientId) return [player, game];
        }
      }
    }
  }
};

export default Logic;
