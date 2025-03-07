import React from "react";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

interface IntFluidProps {
  gridImage: string;
  choices: string[];
}

const IntFluid: React.FC<IntFluidProps> = ({ gridImage, choices }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Paper
        style={{
          borderRadius: "15px",
          display: "flex",
          justifyContent: "center",
          padding: "32px",
          alignItems: "center",
          maxWidth: "fit-content",
        }}
      >
        {/* Grid Image */}
        <img
          src={gridImage}
          alt="Grid"
          style={{ maxWidth: "450px", height: "auto" }}
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
              onClick={() => console.log(`Clicked on choice ${index}`)}
            >
              <img
                src={choice}
                alt={`Choice ${index}`}
                style={{ maxWidth: "150px", transition: "transform 0.3s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
};

export default IntFluid;
