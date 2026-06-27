import React from "react";
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import {
  deleteGameSession,
  GameSession,
  GameSessionReply,
  getAllGameSessionsForCurrentUser,
  getGameSessionById,
} from "@api/gameSession";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

export const MyGameSessions: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [sessions, setSessions] = React.useState<GameSession[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsLoading, setDetailsLoading] = React.useState(false);
  const [selectedSession, setSelectedSession] =
    React.useState<GameSessionReply | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await getAllGameSessionsForCurrentUser();
      setSessions(response.data || []);
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.message || "Failed to fetch game sessions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSessions();
  }, []);

  const handleOpenDetails = async (id: number) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    try {
      const response = await getGameSessionById(id);
      setSelectedSession(response.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to fetch session details",
        type: "error",
      });
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Delete this game session? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteGameSession(id);
      showToast({ message: "Game session deleted", type: "success" });
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to delete game session",
        type: "error",
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  const pagedRows = sessions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <SportsEsportsIcon sx={{ color: "#7c3aed" }} />
        <Typography variant="h2">My Game Sessions</Typography>
      </Box>

      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700 }}>Session ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Game Template ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Started</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ended</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Accuracy</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pagedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    No game sessions found
                  </TableCell>
                </TableRow>
              ) : (
                pagedRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.gameTemplateId ?? "-"}</TableCell>
                    <TableCell>{formatDateTime(row.startTime)}</TableCell>
                    <TableCell>{formatDateTime(row.endTime)}</TableCell>
                    <TableCell>{row.score ?? "-"}</TableCell>
                    <TableCell>
                      {row.accuracy != null ? (
                        <Chip
                          size="small"
                          label={row.accuracy + "%"}
                          sx={{
                            bgcolor: "#ecfdf5",
                            color: "#15803d",
                            fontWeight: 600,
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View details">
                        <IconButton onClick={() => handleOpenDetails(row.id)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete session">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(row.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sessions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Game Session Details</DialogTitle>
        <DialogContent dividers>
          {detailsLoading ? (
            <Typography>Loading...</Typography>
          ) : !selectedSession ? (
            <Typography>No session selected</Typography>
          ) : (
            <Box sx={{ display: "grid", gap: 1.25 }}>
              <Typography>Session ID: {selectedSession.id}</Typography>
              <Typography>User ID: {selectedSession.userId}</Typography>
              <Typography>Game Template ID: {selectedSession.gameTemplateId}</Typography>
              <Typography>Game Type: {selectedSession.gameType || "-"}</Typography>
              <Typography>Game Name: {selectedSession.gameName || "-"}</Typography>
              <Typography>Start: {formatDateTime(selectedSession.startTime)}</Typography>
              <Typography>End: {formatDateTime(selectedSession.endTime)}</Typography>
              <Typography>Score: {selectedSession.score ?? "-"}</Typography>
              <Typography>Accuracy: {selectedSession.accuracy ?? "-"}</Typography>
              <Typography>
                Metadata:
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(selectedSession.metadata ?? {}, null, 2)}
                </pre>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};