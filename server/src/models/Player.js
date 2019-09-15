"use strict";

import uuid from "uuid/v4";
import jwt from "jsonwebtoken";

import "dotenv/config";

class Player {
  constructor(name) {
    // generate universal unique identifier
    this.uuid = uuid();

    // random name
    this.name = name || this.randomName();

    // generate jwt
    this.token = null;
    this.encodeToken();
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
    this.token = jwt.sign({ user: this }, process.env.SECRET_KEY);
  }

  decodeToken() {
    return jwt.decode(this.token);
  }
}

export default Player;
