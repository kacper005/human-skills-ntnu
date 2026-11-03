import React from "react";
import { useNavigate } from "react-router-dom";
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
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { ConfirmDialog } from "@atoms/ConfirmDialog";
import {
  deleteGameSession,
  GameSession,
  GameSessionScore,
  getAllGameSessionsForCurrentUser,
} from "@api/gameSession";
import { getGameTypeDisplayName } from "@enums/GameType";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

const formatDuration = (start: string, end: string) => {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(ms) || ms < 0) return "-";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
};

// Turns score keys like "totalAnswers" into "Total answers"
const formatScoreLabel = (key: string) => {
  const spaced = key.replace(/([A-Z])/g, " $1").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const formatScoreValue = (key: string, value: unknown) => {
  if (value == null) return "-";
  if (key === "accuracy" && typeof value === "number") return `${value}%`;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const getScoreValue = (score: GameSessionScore | null, key: string) =>
  formatScoreValue(key, score?.[key]);

export const MyGameSessions: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [loadFailed, setLoadFailed] = React.useState(false);
  const [sessions, setSessions] = React.useState<GameSession[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [selectedSession, setSelectedSession] =
    React.useState<GameSession | null>(null);
  const [sessionToDelete, setSessionToDelete] =
    React.useState<GameSession | null>(null);

  const fetchSessions = React.useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const response = await getAllGameSessionsForCurrentUser();
      setSessions(response.data || []);
    } catch {
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const confirmAndDelete = async () => {
    if (!sessionToDelete) return;

    try {
      await deleteGameSession(sessionToDelete.id);
      showToast({ message: "Game session deleted", type: "success" });
      const remaining = sessions.filter((s) => s.id !== sessionToDelete.id);
      setSessions(remaining);
      if (page > 0 && page * rowsPerPage >= remaining.length) {
        setPage(page - 1);
      }
    } catch {
      showToast({ message: "Failed to delete game session", type: "error" });
    } finally {
      setSessionToDelete(null);
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

      {loadFailed ? (
        <Card sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
          <Typography sx={{ mb: 2, color: "#64748b" }}>
            Could not load your game sessions.
          </Typography>
          <Button variant="contained" onClick={fetchSessions}>
            Try again
          </Button>
        </Card>
      ) : sessions.length === 0 ? (
        <Card sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
          <Typography sx={{ mb: 2, color: "#64748b" }}>
            You have not played any games yet.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/home")}>
            Find a game
          </Button>
        </Card>
      ) : (
        <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Game</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Started</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Points</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Accuracy</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pagedRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{row.gameName}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={getGameTypeDisplayName(row.gameType)}
                        sx={{ bgcolor: "#ede9fe", color: "#7c3aed", fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>{formatDateTime(row.startTime)}</TableCell>
                    <TableCell>{formatDuration(row.startTime, row.endTime)}</TableCell>
                    <TableCell>{getScoreValue(row.score, "points")}</TableCell>
                    <TableCell>{getScoreValue(row.score, "accuracy")}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View details">
                        <IconButton onClick={() => setSelectedSession(row)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete session">
                        <IconButton
                          color="error"
                          onClick={() => setSessionToDelete(row)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
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
      )}

      <Dialog
        open={selectedSession != null}
        onClose={() => setSelectedSession(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Game Session Details</DialogTitle>
        <DialogContent dividers>
          {selectedSession && (
            <Box sx={{ display: "grid", gap: 1.25 }}>
              <Typography>
                <strong>Game:</strong> {selectedSession.gameName}
              </Typography>
              <Typography>
                <strong>Type:</strong>{" "}
                {getGameTypeDisplayName(selectedSession.gameType)}
              </Typography>
              <Typography>
                <strong>Started:</strong>{" "}
                {formatDateTime(selectedSession.startTime)}
              </Typography>
              <Typography>
                <strong>Ended:</strong> {formatDateTime(selectedSession.endTime)}
              </Typography>
              <Typography>
                <strong>Duration:</strong>{" "}
                {formatDuration(selectedSession.startTime, selectedSession.endTime)}
              </Typography>
              <Divider />
              {Object.entries(selectedSession.score ?? {}).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{formatScoreLabel(key)}:</strong>{" "}
                  {formatScoreValue(key, value)}
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSession(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={sessionToDelete != null}
        title="Delete Game Session"
        content="Are you sure you want to delete this game session? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => setSessionToDelete(null)}
        onConfirm={confirmAndDelete}
      />
    </Box>
  );
};
