import React from "react";
import "./App.css";

import Header from "../components/Header/Header";
import Board from "../components/Board/Board";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Board />
      </div>
    );
  }
}

export default App;
