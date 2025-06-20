import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { TestCardGrid } from "../TestCardGrid";
import { GameCardGrid } from "../GameCardGrid";
import { useAuth } from "@hooks/useAuth";
import { getAllTestTemplates, TestTemplate } from "@api/testTemplate";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";

export const Home: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [testTemplates, setTestTemplates] = React.useState<TestTemplate[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllTestTemplates();
        setTestTemplates(response.data);
      } catch (err: any) {
        showToast({ message: "Failed to fetch test templates", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography color="secondary" fontWeight="bold" variant="h1">
        Welcome {user?.firstName}!
      </Typography>
      <br />

      <br />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {" "}
          <TestCardGrid testTemplates={testTemplates} /> <br />
          <GameCardGrid />
        </>
      )}
    </Box>
  );
};
