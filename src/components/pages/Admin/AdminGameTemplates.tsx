import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import {
  getAllTestSessions,
  TestSession,
  updateTestSessionDescription,
} from "@api/testSession";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "../../atoms/LoadingSpinner";
import { GenericTable } from "../../organisms/GenericTable";
import { getTestTypeDisplayName } from "@enums/TestType";

const columns: {
  id: keyof TestSession | string;
  label: string;
  minWidth: number;
  format?: (value: any) => React.ReactNode;
}[] = [
  { id: "name", label: "Session Name", minWidth: 180 },
  {
    id: "gameType",
    label: "Game Type",
    minWidth: 120,
    format: (value) => getTestTypeDisplayName(value),
  },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "startedAt", label: "Started At", minWidth: 160, format: (v) => (v ? new Date(v).toLocaleString() : "-") },
];

export const AdminGameTemplates: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [sessions, setSessions] = React.useState<TestSession[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedSession, setSelectedSession] = React.useState<TestSession | null>(null);

  const [description, setDescription] = React.useState("");

  const fetchAllSessions = async () => {
    try {
      const res = await getAllTestSessions();
      const items = Array.isArray(res) ? res : Array.isArray((res as any).data) ? (res as any).data : (res as any).items ?? [];
      setSessions(items);
    } catch (err: any) {
      showToast({
        message: err?.response?.data?.message || "Failed to fetch test sessions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllSessions();
  }, []);

  const openEditDialog = (session: TestSession) => {
    setSelectedSession(session);
    setDescription((session as any).description || (session as any).notes || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedSession) return;
    try {
      await updateTestSessionDescription(selectedSession.id, description);
      showToast({
        message: "Test session updated successfully!",
        type: "success",
      });
      setDialogOpen(false);
      fetchAllSessions();
    } catch (err: any) {
      showToast({ message: "Failed to update test session", type: "error" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Game Types
      </Typography>
      <GenericTable
        columns={columns as unknown as any} // consider fixing TestSession type instead of casting
        rows={sessions}
        onRowClick={openEditDialog}
      />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Session Description</DialogTitle>
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