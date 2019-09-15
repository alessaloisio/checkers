"use strict";

import uuid from "uuid/v4";
import jwt from "jsonwebtoken";

import "dotenv/config";

class Users {
  constructor(name) {
    // generate universal unique identifier
    this.uuid = uuid();

    // random name
    this.name = name || this.randomName();

    // generate jwt
    this.token = jwt.sign({ user: this }, process.env.SECRET_KEY);
  }

  randomName() {
    let sum = 0;

    Array.from(this.uuid).map(x => {
      x = parseInt(x);
      if (x) sum += x;
    });

    return "player" + sum;
  }

  decodeToken() {
    return jwt.decode(this.token);
  }
}

export default Users;
