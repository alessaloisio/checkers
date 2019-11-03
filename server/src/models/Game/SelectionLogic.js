"use strict";

import SelectedBox from "./SelectedBox";
import getPlayerGame from "./getPlayerGame";
import EndGame from "./EndGame";

const Logic = props => {
  const { io, client, games } = props.self;
  const { boxId } = props;

  const [player, game] = getPlayerGame(games, client.id);

  const selectedBox = new SelectedBox({ boxId, player, game });

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

            // Verify End Game
            const winner = game.board.verifyEndGame();
            if (winner) {
              EndGame({
                self: props.self,
                winner: game.players.filter(p => p.boardPawnsId === winner)[0]
              });
            }
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

export default Logic;
