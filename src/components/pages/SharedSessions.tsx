import React from "react";
import { Typography } from "@mui/material";
import { getTestSessionFormattedById, TestSessionView } from "@api/testSession";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { SessionDetailsDialog } from "@molecules/SessionDetailsDialog";
import { GenericTable } from "@organisms/GenericTable";
import { getSharedTestSessions } from "@api/studentTeacher";

const columns: {
  id: keyof TestSessionView;
  label: string;
  minWidth: number;
  format?: (value: any) => React.ReactNode;
}[] = [
  { id: "testName", label: "Test Name", minWidth: 150 },
  { id: "userEmail", label: "User Email", minWidth: 200 },
  {
    id: "startTime",
    label: "Start Time",
    minWidth: 150,
    format: (value) => new Date(value).toLocaleString(),
  },
  {
    id: "endTime",
    label: "End Time",
    minWidth: 150,
    format: (value) => new Date(value).toLocaleString(),
  },
];

export const SharedSessions: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [testSessions, setTestSessions] = React.useState<TestSessionView[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedSession, setSelectedSession] =
    React.useState<TestSessionView | null>(null);
  const [sessionDialogLoading, setSessionDialogLoading] = React.useState(false);

  const fetchData = async () => {
    try {
      const response = await getSharedTestSessions();
      const sharedSessions = response.data as unknown as TestSessionView[];

      setTestSessions(sharedSessions);
    } catch (error) {
      console.error("Error fetching shared test sessions:", error);
      showToast({ message: "Failed to load shared sessions", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = async (row: TestSessionView) => {
    setDialogOpen(true);
    setSessionDialogLoading(true);
    try {
      const response = await getTestSessionFormattedById(row.id);
      setSelectedSession(response.data);
    } catch (error) {
      console.error("Failed to fetch session details", error);
      showToast({ message: "Could not load session details", type: "error" });
      setDialogOpen(false);
    } finally {
      setSessionDialogLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleExportJSON = () => {
    if (!selectedSession) return;
    const jsonStr = JSON.stringify(selectedSession, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `test-session-${selectedSession.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Shared Test Sessions
      </Typography>
      <GenericTable
        columns={columns}
        rows={testSessions}
        onRowClick={handleRowClick}
      />

      <SessionDetailsDialog
        dialogOpen={dialogOpen}
        onClose={handleCloseDialog}
        onExport={handleExportJSON}
        selectedRow={selectedSession}
        loading={sessionDialogLoading}
      />
    </div>
  );
};
