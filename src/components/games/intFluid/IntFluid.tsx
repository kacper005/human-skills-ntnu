import React from "react";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

interface IntFluidProps {
  gridImage: string; // full base path without extension (e.g., "/games/intFluid/tiles/Q1/grid")
  choices: string[]; // full base path without extension
  correctChoice: string;
  onChoiceClick: (choice: string) => void;
}

const ImageWithFallback: React.FC<{
  basePath: string;
  alt: string;
  style?: React.CSSProperties;
}> = ({ basePath, alt, style }) => (
  <picture>
    <source srcSet={`${basePath}.png`} type="image/gif" />
    <source srcSet={`${basePath}.png`} type="image/png" />
    <img src={`${basePath}.png`} alt={alt} style={style} />
  </picture>
);

export const IntFluid: React.FC<IntFluidProps> = ({
  gridImage,
  choices,
  onChoiceClick,
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Paper
        style={{
          borderRadius: "15px",
          display: "flex",
          justifyContent: "center",
          padding: "32px",
          alignItems: "center",
          maxWidth: "90vw",
          flexWrap: "wrap",
        }}
      >
        {/* Grid Image */}
        <ImageWithFallback
          basePath={gridImage}
          alt="Grid"
          style={{
            width: "40vw",
            maxWidth: "400px",
            height: "auto",
            objectFit: "contain",
          }}
        />

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem style={{ margin: "0 16px" }} />

        {/* Choices Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
          }}
        >
          {choices.map((choice, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => onChoiceClick(choice)}
            >
              <ImageWithFallback
                basePath={choice}
                alt={`Choice ${index}`}
                style={{
                  width: "15vw",
                  maxWidth: "120px",
                  height: "15vw",
                  maxHeight: "120px",
                  objectFit: "contain",
                  transition: "transform 0.3s",
                }}
              />
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
};
