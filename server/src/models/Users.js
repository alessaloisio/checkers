"use strict";

import uuid from "uuid/v4";

class Users {
  constructor(name) {
    // generate universal unique identifier
    this.uuid = uuid();

    // random name
    this.name = name || this.randomName();

    // generate jwt
  }

  randomName() {
    let sum = 0;

    Array.from(this.uuid).map(x => {
      x = parseInt(x);
      if (x) sum += x;
    });

    return "player" + sum;
  }
}

export default Users;
