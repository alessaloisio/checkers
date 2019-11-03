"use strict";

import getPlayerGame from "./getPlayerGame";

const GiveUp = props => {
  const { io, client, games } = props.self;

  const [player, game] = getPlayerGame(games, client.id);

  console.log(game);
};

export default GiveUp;
