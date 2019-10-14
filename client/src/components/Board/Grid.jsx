import React, { useEffect, useRef } from "react";

// Grid init
const Grid = props => {
  const gridRef = useRef(null);

  const createBoxes = () => {
    let boxes = [];

    for (let i = 1; i < 51; i++) {
      boxes.push(<span key={i} id={i} className="case"></span>);
    }

    return boxes;
  };

  // 1st mounted
  useEffect(() => {
    initGrid();
  }, []);

  const initGrid = () => {
    const grid = gridRef.current;

    // INIT VARS
    const gridWidth = grid.clientWidth,
      // gridHeight = grid.clientHeight,
      gridCaseDim = gridWidth / 10,
      boxes = Array.from(grid.childNodes);

    let x = 0,
      y = 0,
      key = 0;

    for (let i = 0; i < 10; i++) {
      // after first line
      if (i > 0) y += gridCaseDim;
      // after last element in line, go back to 0 or for even -case
      if (i % 2 === 0) x = 0;
      else x = -gridCaseDim;
      for (let j = 0; j < 5; j++) {
        // move case to right
        if (j > 0) x += gridCaseDim * 2;
        else x += gridCaseDim;

        // Position case
        boxes[key].style.left = `${x}px`;
        boxes[key++].style.top = `${y}px`;
      }
    }
  };

  // On ready
  useEffect(() => {
    if (props.ready) console.log("ready ????");
  }, [props.ready]);

  return (
    <div ref={gridRef} className="grid">
      {createBoxes()}
    </div>
  );
};

export default Grid;
