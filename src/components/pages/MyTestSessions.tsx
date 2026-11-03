import React from "react";
import { Button, Card, Typography } from "@mui/material";
import {
  deleteTestSession,
  getAllTestSessionsFormatted,
  getTestSessionFormattedById,
  TestSessionView,
} from "@api/testSession";
import { showToast } from "@atoms/Toast";
import { ShareDialog } from "@atoms/ShareDialog";
import { ConfirmDialog } from "@atoms/ConfirmDialog";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { SessionDetailsDialog } from "@molecules/SessionDetailsDialog";
import { GenericTable } from "@organisms/GenericTable";

const columns: {
  id: keyof TestSessionView;
  label: string;
  minWidth: number;
  format?: (value: any) => React.ReactNode;
}[] = [
  { id: "testName", label: "Test Name", minWidth: 150 },
  { id: "testDescription", label: "Test Description", minWidth: 200 },
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

export const MyTestSessions: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [loadFailed, setLoadFailed] = React.useState(false);
  const [testSessions, setTestSessions] = React.useState<TestSessionView[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [selectedSession, setSelectedSession] =
    React.useState<TestSessionView | null>(null);
  const [sessionDialogLoading, setSessionDialogLoading] = React.useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  const handleRowClick = async (row: TestSessionView) => {
    setDialogOpen(true);
    setSessionDialogLoading(true);
    try {
      const response = await getTestSessionFormattedById(row.id);
      setSelectedSession(response.data);
    } catch {
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

  const fetchAllTestSessions = React.useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const response = await getAllTestSessionsFormatted();
      setTestSessions(response.data || []);
    } catch {
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAllTestSessions();
  }, [fetchAllTestSessions]);

  const confirmAndDelete = async () => {
    if (!selectedSession) return;

    try {
      await deleteTestSession(selectedSession.id);
      showToast({ message: "Session deleted", type: "success" });
      setTestSessions((prev) =>
        prev.filter((s) => s.id !== selectedSession.id)
      );
      handleCloseDialog();
    } catch {
      showToast({ message: "Failed to delete session", type: "error" });
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleShare = async () => {
    setShareDialogOpen(true);
  };

  const handleRequestDelete = () => {
    setConfirmDialogOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        My Test Sessions
      </Typography>
      {loadFailed ? (
        <Card sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
          <Typography sx={{ mb: 2, color: "#64748b" }}>
            Could not load your test sessions.
          </Typography>
          <Button variant="contained" onClick={fetchAllTestSessions}>
            Try again
          </Button>
        </Card>
      ) : (
        <GenericTable
          columns={columns}
          rows={testSessions}
          onRowClick={handleRowClick}
          emptyMessage="You have not taken any tests yet."
        />
      )}

      <SessionDetailsDialog
        dialogOpen={dialogOpen}
        onClose={handleCloseDialog}
        onExport={handleExportJSON}
        onDelete={handleRequestDelete}
        onShare={handleShare}
        selectedRow={selectedSession}
        loading={sessionDialogLoading}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Test Session"
        content="Are you sure you want to delete this test session? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmationWord="Delete"
        confirmationPrompt='Type "Delete" to confirm.'
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmAndDelete}
      />
      {selectedSession && (
        <ShareDialog
          title="Share Test Session"
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          testSessionId={selectedSession.id}
        />
      )}
    </div>
  );
};
