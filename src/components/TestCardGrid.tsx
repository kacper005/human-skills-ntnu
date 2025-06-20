import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TestCard } from "./TestCard";
import { TestTemplate } from "@api/testTemplate";
import { TestInfoModal } from "./molecules/TestInfoModal";
import { useNavigate } from "react-router-dom";
import { getTestOptionTypeDisplayName } from "@enums/TestOptionType";
import { showToast } from "./atoms/Toast";

interface Props {
  testTemplates: TestTemplate[];
}

export const TestCardGrid: React.FC<Props> = ({ testTemplates }) => {
  const [selectedTest, setSelectedTest] = React.useState<TestTemplate | null>(
    null
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleCardClick = (template: TestTemplate) => {
    setSelectedTest(template);
    setModalOpen(true);
  };

  const handleStartTest = () => {
    setModalOpen(false);
    if (selectedTest) {
      switch (selectedTest.testType) {
        case "BIG_5":
          navigate("/test/big5");
          break;
        case "INTELLIGENCE_FLUID":
          navigate("/test/int-fluid");
          break;
        default:
          showToast({ message: "Unsupported test type", type: "warning" });
          break;
      }
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h2" color="secondary" paddingBottom="24px">
          <Box sx={{ fontWeight: "bold" }}>Tests</Box>
        </Typography>
        <Grid
          item
          container
          spacing={{ xs: 3, sm: 3, md: 3 }}
          columns={{ xs: 2, sm: 2, md: 8, lg: 12 }}
        >
          {testTemplates.map((template, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <TestCard
                title={template.name}
                description={template.description}
                type={getTestOptionTypeDisplayName(template.optionType)}
                onClick={() => handleCardClick(template)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {selectedTest && (
        <TestInfoModal
          open={modalOpen}
          title={selectedTest.name}
          description={selectedTest.description}
          onClose={() => setModalOpen(false)}
          onStart={handleStartTest}
        />
      )}
    </>
  );
};
