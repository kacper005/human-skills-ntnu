import React from "react";
import GameCardGrid from "./GameCardGrid";
import TestCardGrid from "./TestCardGrid";

const Home: React.FC = () => {
  return (
    <div>
      <GameCardGrid />
      <br />
      <TestCardGrid />
    </div>
  );
};

export default Home;
