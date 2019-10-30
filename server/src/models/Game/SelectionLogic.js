"use strict";

import SelectedBox from "./SelectedBox";

const Logic = props => {
  const { io, client, games } = props.self;
  const { boxId } = props;

  let player = null;
  const game = games.filter(game => {
    player = game.players.filter(player => player.id === client.id)[0];
    return player;
  })[0];

  const selectedBox = new SelectedBox({ boxId, player, game });
  console.log(selectedBox);

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

            // Before switch verify
            let switchHand = true;

            game.board.getDiagonalBox(selectedBox.boxId).map(diagonal => {
              // if (
              //   (selectedBox.typePawnsId === 2 &&
              //     game.board.grid[diagonal - 1] === 1) ||
              //   (selectedBox.typePawnsId === 1 &&
              //     game.board.grid[diagonal - 1] === 2)
              // ) {
              //   switchHand = false;
              //   return;
              // }
              console.log(diagonal);
              console.log(game.board.grid[selectedBox.boxId - 1]);
              console.log(game.board.grid[diagonal - 1]);
            });

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

export default Logic;
