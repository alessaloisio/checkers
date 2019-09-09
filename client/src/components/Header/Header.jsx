import React, { useRef } from "react";
import "./Header.scss";

import { subscribe } from "../../socket/subscribe";

const Header = () => {
  const usernameRef = useRef(null);

  const handlerPlay = () => {
    if (usernameRef.current.value === "") usernameRef.current.focus();
    else {
      subscribe(
        (err, player) => console.log(player),
        usernameRef.current.value
      );
    }
  };

  return (
    <header className="Header">
      <a className="title" href="/" alt="Home Cherckers">
        Checkers
      </a>

      <div className="right">
        <input ref={usernameRef} type="text" placeholder="Nickname" />
        <button type="submit" onClick={handlerPlay}>
          Play !
        </button>
      </div>
    </header>
  );
};

export default Header;
