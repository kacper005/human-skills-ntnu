import React from "react";
import { Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export interface InfoTooltipProps {
  title: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ title }) => {
  return (
    <Tooltip title={title} sx={{ cursor: "pointer" }}>
      <InfoOutlinedIcon
        color="primary"
        fontSize="large"
        sx={{ cursor: "pointer", fontSize: 30 }}
      />
    </Tooltip>
  );
};
