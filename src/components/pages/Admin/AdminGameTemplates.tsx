import React, { useState } from "react";
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
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import InboxIcon from "@mui/icons-material/Inbox";
import {
  getAllTestSessions,
  TestSession,
  updateTestSessionDescription,
} from "@api/testSession";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { getTestTypeDisplayName } from "@enums/TestType";

const GAME_TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  Attention: { bg: "#ede9fe", color: "#7c3aed" },
  Balloon: { bg: "#fce7f3", color: "#db2777" },
  CogFlex: { bg: "#ecfdf5", color: "#059669" },
};

export const AdminGameTemplates: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TestSession | null>(
    null
  );
  const [description, setDescription] = useState("");

  const fetchAllSessions = async () => {
    try {
      const res = await getAllTestSessions();
      const items = Array.isArray(res)
        ? res
        : Array.isArray((res as any).data)
          ? (res as any).data
          : ((res as any).items ?? []);
      setSessions(items);
    } catch (err: any) {
      showToast({
        message:
          err?.response?.data?.message || "Failed to fetch test sessions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllSessions();
  }, []);

  const filtered = sessions.filter((s) => {
    const name = (s as any).name || "";
    const gameType = (s as any).gameType || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      gameType.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openEditDialog = (session: TestSession) => {
    setSelectedSession(session);
    setDescription(
      (session as any).description || (session as any).notes || ""
    );
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

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#22c55e",
            }}
          >
            <SportsEsportsIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#1e293b" }}
            >
              Game Templates
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              View cognitive game sessions and configurations
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Actions Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search games..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: 300,
            "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "white" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94a3b8" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Session Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Game Type
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Started At
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, color: "#475569" }}
                  align="right"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <InboxIcon
                      sx={{
                        fontSize: 48,
                        color: "#cbd5e1",
                        mb: 1,
                        display: "block",
                        mx: "auto",
                      }}
                    />
                    <Typography variant="body1" sx={{ color: "#94a3b8" }}>
                      No game templates found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((session) => {
                    const name = (session as any).name || `Session #${session.id}`;
                    const gameType = (session as any).gameType
                      ? getTestTypeDisplayName((session as any).gameType)
                      : "-";
                    const status = (session as any).status || "-";
                    const startedAt = session.startTime;
                    return (
                      <TableRow
                        key={session.id}
                        sx={{
                          "&:hover": { bgcolor: "#fafafa" },
                          transition: "background-color 0.15s",
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#1e293b" }}
                          >
                            {name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={gameType}
                            size="small"
                            sx={{
                              bgcolor:
                                GAME_TYPE_STYLES[gameType]?.bg || "#f1f5f9",
                              color:
                                GAME_TYPE_STYLES[gameType]?.color || "#475569",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={status}
                            size="small"
                            sx={{
                              bgcolor:
                                status === "active" ? "#f0fdf4" : "#f1f5f9",
                              color:
                                status === "active" ? "#16a34a" : "#64748b",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "#64748b" }}
                          >
                            {startedAt
                              ? new Date(startedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "-"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit description">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(session)}
                              sx={{
                                color: "#64748b",
                                "&:hover": { color: "#22c55e" },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: "1px solid #e2e8f0" }}
        />
      </Card>

      {/* Edit Description Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Session Description</DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
    </Box>
  );
};