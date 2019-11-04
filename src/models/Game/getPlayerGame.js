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

  return [null, null];
};

export default getPlayerGame;
