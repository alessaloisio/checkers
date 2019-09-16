import React, { useRef, useState, useEffect } from "react";
import "./Header.scss";

import { getPlayerInfo, changeNamePlayer, playBtn } from "../../socket";

const Header = () => {
  const usernameRef = useRef(null);
  const [Username, setUsername] = useState("Nickname");

  // With REACT we can't addgetUserInfo async on useEffect
  // Components Mounted, get default player info from server
  useEffect(() => {
    getPlayerInfo((err, player) => {
      setUsername(player.name);
    });
  });

  const handlerPlay = () => {
    // Change the Player Name
    if (
      usernameRef.current.value !== "" &&
      usernameRef.current.value !== Username
    ) {
      changeNamePlayer(usernameRef.current.value);
      usernameRef.current.value = "";
      getPlayerInfo((err, player) => {
        setUsername(player.name);
      });
    }

    playBtn((err, game) => {
      console.log(game);
    });
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
