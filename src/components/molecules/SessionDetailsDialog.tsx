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
import Grid from "@mui/material/Grid";
import { TestSessionView } from "@api/testSession";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { getRoleDisplayName } from "@enums/Role";

interface SessionDetailsDialogProps {
  dialogOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  selectedRow: TestSessionView | null;
  loading: boolean;
}

export const SessionDetailsDialog: React.FC<SessionDetailsDialogProps> = ({
  dialogOpen,
  onClose,
  onExport,
  onShare,
  onDelete,
  selectedRow,
  loading,
}) => {
  return (
    <Dialog open={dialogOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{`${
        selectedRow?.testName ?? ""
      } Session Details`}</DialogTitle>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <DialogContent dividers>
          {selectedRow && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>User Email:</strong> {selectedRow.userEmail}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>User Role:</strong>{" "}
                    {getRoleDisplayName(selectedRow.userRole)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Test Name:</strong> {selectedRow.testName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Description:</strong> {selectedRow.testDescription}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Start Time:</strong>{" "}
                    {new Date(selectedRow.startTime).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>End Time:</strong>{" "}
                    {new Date(selectedRow.endTime).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {selectedRow.score != 0 && (
                    <Typography>
                      <strong>Score</strong> {selectedRow.score}
                    </Typography>
                  )}
                </Grid>
              </Grid>

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
                      <TableCell>
                        {choice.answer.includes("Incorrect")
                          ? `${choice.answer} ❌`
                          : choice.answer.includes("Correct")
                          ? `${choice.answer} ✅`
                          : choice.answer}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      )}

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {onDelete && (
          <Button onClick={onDelete} variant="contained" color="error">
            Delete
          </Button>
        )}
        <Button onClick={onExport} variant="contained">
          Export JSON
        </Button>
        {onShare && (
          <Button onClick={onShare} variant="contained" color="primary">
            Share
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
