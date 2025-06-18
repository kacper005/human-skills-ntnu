import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getAllTestSessionsFormatted, TestSessionView } from "@api/testSession";
import { getRoleDisplayName } from "@enums/Role";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
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
  const [testSessions, setTestSessions] = React.useState<TestSessionView[]>([]);
  const [selectedRow, setSelectedRow] = React.useState<TestSessionView | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRowClick = (row: TestSessionView) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  React.useEffect(() => {
    const fetchAllTestSessions = async () => {
      try {
        const response = await getAllTestSessionsFormatted();
        console.log(response.data);
        setTestSessions(response.data || []);
      } catch (error) {
        console.error("Error fetching test sessions:", error);
        showToast({ message: "Failed to fetch test sessions", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchAllTestSessions();
  }, []);

  const handleExportJSON = () => {
    if (!selectedRow) return;
    const jsonStr = JSON.stringify(selectedRow, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `test-session-${selectedRow.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        My Test Sessions
      </Typography>
      <GenericTable
        columns={columns}
        rows={testSessions}
        onRowClick={handleRowClick}
      />

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Session Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Typography>
                <strong>User Email:</strong> {selectedRow.userEmail}
              </Typography>
              <Typography>
                <strong>User Role:</strong>{" "}
                {getRoleDisplayName(selectedRow.userRole)}
              </Typography>
              <Typography>
                <strong>Test Name:</strong> {selectedRow.testName}
              </Typography>
              <Typography>
                <strong>Description:</strong> {selectedRow.testDescription}
              </Typography>
              <Typography>
                <strong>Start Time:</strong>{" "}
                {new Date(selectedRow.startTime).toLocaleString()}
              </Typography>
              <Typography>
                <strong>End Time:</strong>{" "}
                {new Date(selectedRow.endTime).toLocaleString()}
              </Typography>

              <Typography variant="h6" gutterBottom>
                <strong>Choices</strong>
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Question</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Answer</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedRow.choices.map((choice, index) => (
                    <TableRow key={index}>
                      <TableCell>{choice.question}</TableCell>
                      <TableCell>{choice.answer}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Close
          </Button>
          <Button onClick={handleExportJSON} variant="contained">
            Export JSON
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
