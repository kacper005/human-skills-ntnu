import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { getAllTestTemplates, TestTemplate } from "@api/testTemplate";
import { useAuth } from "@hooks/useAuth";
import { showToast } from "@atoms/Toast";
import { WelcomeDialog } from "@atoms/WelcomeDialog";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { TestCardGrid } from "../TestCardGrid";
import { GameCardGrid } from "../GameCardGrid";

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
      <WelcomeDialog />
    </Box>
  );
};
