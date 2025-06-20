import React from "react";
import {
  getAllTestTemplates,
  TestTemplate,
  updateTestTemplateDescription,
} from "@api/testTemplate";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { showToast } from "@atoms/Toast";
import { GenericTable } from "@organisms/GenericTable";
import { getTestOptionTypeDisplayName } from "@enums/TestOptionType";
import { getTestTypeDisplayName } from "@enums/TestType";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

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
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [selectedTestTemplate, setSelectedTestTemplate] =
    React.useState<TestTemplate | null>(null);

  const [description, setDescription] = React.useState("");

  const fetchAllTestTemplates = async () => {
    try {
      const response = await getAllTestTemplates();

      setTestTemplates(response.data || []);
    } catch (err: any) {
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

  const openEditDialog = (testTemplate: TestTemplate) => {
    setSelectedTestTemplate(testTemplate);
    setDescription(testTemplate.description || "");
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isEdit && selectedTestTemplate) {
        await updateTestTemplateDescription(
          selectedTestTemplate.id,
          description
        );

        showToast({
          message: "Test template updated successfully!",
          type: "success",
        });
      }

      setDialogOpen(false);
      fetchAllTestTemplates();
    } catch (error) {
      showToast({ message: "Failed to update test template", type: "error" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Test Templates
      </Typography>
      <GenericTable
        columns={columns}
        rows={testTemplates}
        onRowClick={openEditDialog}
      />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Test Description</DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            name="description"
            value={description}
            onChange={handleChange}
            fullWidth
            margin="dense"
            autoFocus
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
