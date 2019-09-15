import React, { useRef, useState, useEffect } from "react";
import "./Header.scss";

import { newPlayer, playBtn } from "../../socket";
import { resolve } from "dns";

const Header = () => {
  const usernameRef = useRef(null);
  const [Username, setUsername] = useState("Nickname");

  useEffect(() => {
    // With REACT we can't add async on useEffect
    (async () => {
      const player = await newPlayer();
      usernameRef.current.value = player.name;
      console.log(player);
    })();
  });

  const handlerPlay = () => {
    if (usernameRef.current.value === "") usernameRef.current.focus();
    else {
      playBtn((err, player) => console.log(player));
    }
  };

  return (
    <header className="Header">
      <a className="title" href="/" alt="Home Cherckers">
        Checkers
      </a>

      <div className="right">
        <input ref={usernameRef} type="text" placeholder={Username} />
        <button type="submit" onClick={handlerPlay}>
          Play !
        </button>
      </div>
    </header>
  );
};

export default Header;
