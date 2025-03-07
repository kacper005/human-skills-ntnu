import React, { useEffect, useState } from "react";
import IntFluid from "./IntFluid";

const IntFluidController: React.FC = () => {
  const [choices, setChoices] = useState<string[]>([]);
  const [gridImage, setGridImage] = useState<string>("");

  useEffect(() => {
    const fetchGameAssets = async () => {
      const gamePath = "/public/games/intFluid/1/";
      const gridImagePath = `${gamePath}im1.svg`;
      const choicePaths = Array.from(
        { length: 6 },
        (_, i) => `${gamePath}c${i + 1}.svg`
      );

      setGridImage(gridImagePath);

      const shuffledChoices = choicePaths.sort(() => Math.random() - 0.5);
      setChoices(shuffledChoices);
    };

    fetchGameAssets();
  }, []);

  return <IntFluid gridImage={gridImage} choices={choices} />;
};

export default IntFluidController;
