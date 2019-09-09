import React, { useRef } from "react";

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
    <header>
      <h1>Checkers</h1>

      <div className="right">
        <input ref={usernameRef} type="text" placeholder="alessio" />
        <button type="submit" onClick={handlerPlay}>
          Play !
        </button>
      </div>
    </header>
  );
};

export default Header;
