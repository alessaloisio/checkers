"use strict";

import uuid from "uuid/v4";
import jwt from "jsonwebtoken";

import "dotenv/config";

class Player {
  constructor(id) {
    // generate universal unique identifier
    this.uuid = uuid();
    this.id = id;
    this.room = id;

    // random name
    this.name = this.randomName();

    // (connected = 0|readyToPlay = 1|onGame = 2|..)
    this.status = 0;

    this.boardPawnsId = 0;

    // generate jwt
    this.token = null;
  }

  randomName() {
    let sum = 0;

    Array.from(this.uuid).map(x => {
      x = parseInt(x);
      if (x) sum += x;
    });

    return "player" + sum;
  }

  encodeToken() {
    const data = { ...this };
    delete data.token;

    this.token = jwt.sign({ user: data }, process.env.SECRET_KEY, {
      expiresIn: "1h"
    });
  }

  decodeToken() {
    return jwt.decode(this.token);
  }
}

export default Player;
