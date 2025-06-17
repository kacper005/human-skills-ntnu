import { getAllTestTemplates, TestTemplate } from "@/api/testTemplate";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { showToast } from "@/components/atoms/Toast";
import { GenericTable } from "@/components/organisms/GenericTable";
import { getTestOptionTypeDisplayName } from "@/enums/TestOptionType";
import { getTestTypeDisplayName } from "@/enums/TestType";
import { Typography } from "@mui/material";
import React from "react";

const columns: {
  id: keyof TestTemplate;
  label: string;
  minWidth: number;
  format?: (value: any) => React.ReactNode;
}[] = [
  { id: "name", label: "Template Name", minWidth: 150 },
  {
    id: "testType",
    label: "Test Type",
    minWidth: 100,
    format: (value) => getTestTypeDisplayName(value),
  },
  {
    id: "optionType",
    label: "Option Type",
    minWidth: 100,
    format: (value) => getTestOptionTypeDisplayName(value),
  },
];

export const AdminTestTemplates: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [testTemplates, setTestTemplates] = React.useState<TestTemplate[]>([]);

  const fetchAllTestTemplates = async () => {
    try {
      const response = await getAllTestTemplates();
      setTestTemplates(response.data || []);
    } catch (err: any) {
      console.log(err);
      showToast({
        message: err.response?.data?.message || "Failed to fetch test data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllTestTemplates();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Test Templates
      </Typography>
      <GenericTable columns={columns} rows={testTemplates} />
    </div>
  );
};
