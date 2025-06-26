import React from "react";
import { Grid } from "@mui/material";

export const LoadingSpinner: React.FC = () => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ height: "80vh" }}
    >
      <img
        src="/loading.gif"
        alt="Loading..."
        style={{ width: "200px", height: "200px" }}
      />
    </Grid>
  );
};
