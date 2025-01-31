import React from "react";
import GameCardGrid from "./GameCardGrid";
import Quizzes from "./Quizzes";

const Home: React.FC = () => {
  return (
    <div>
      <GameCardGrid />
      <div style={{ margin: "40px 0" }}></div>
      <Quizzes />
    </div>
  );
};

export default Home;
