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
  Switch,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import InboxIcon from "@mui/icons-material/Inbox";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import {
  GameTemplate,
  getAllGameTemplates,
  setGameTemplateActive,
  updateGameTemplateDescription,
} from "@api/gameTemplate";
import { GameType, getGameTypeDisplayName } from "@enums/GameType";

const GAME_TYPE_STYLES: Record<GameType, { bg: string; color: string }> = {
  [GameType.ATTENTION]: { bg: "#ede9fe", color: "#7c3aed" },
  [GameType.BALLOON]: { bg: "#fce7f3", color: "#db2777" },
  [GameType.COGFLEX]: { bg: "#ecfdf5", color: "#059669" },
};

export const AdminGameTemplates: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [templates, setTemplates] = useState<GameTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(
    null
  );
  const [description, setDescription] = useState("");

  const fetchAllTemplates = React.useCallback(async () => {
    setLoadFailed(false);
    try {
      const res = await getAllGameTemplates();
      setTemplates(res.data || []);
    } catch {
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAllTemplates();
  }, [fetchAllTemplates]);

  const filtered = templates.filter((template) => {
    const name = template.name.toLowerCase();
    const gameType = getGameTypeDisplayName(template.gameType).toLowerCase();
    const query = search.toLowerCase();

    return name.includes(query) || gameType.includes(query);
  });

  const handleToggleActive = async (template: GameTemplate) => {
    try {
      await setGameTemplateActive(template.id, !template.active);
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === template.id ? { ...t, active: !template.active } : t
        )
      );
    } catch {
      showToast({ message: "Failed to update game template", type: "error" });
    }
  };

  const openEditDialog = (template: GameTemplate) => {
    setSelectedTemplate(template);
    setDescription(template.description || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;

    try {
      await updateGameTemplateDescription(selectedTemplate.id, description);
      showToast({
        message: "Game template updated successfully!",
        type: "success",
      });
      setDialogOpen(false);
      fetchAllTemplates();
    } catch {
      showToast({ message: "Failed to update game template", type: "error" });
    }
  };

  if (loading) return <LoadingSpinner />;

  if (loadFailed) {
    return (
      <Card sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
        <Typography sx={{ mb: 2, color: "#64748b" }}>
          Could not load game templates.
        </Typography>
        <Button variant="contained" onClick={fetchAllTemplates}>
          Try again
        </Button>
      </Card>
    );
  }

  return (
    <Box>
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
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Game Templates
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              View and edit cognitive game templates
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search templates..."
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

      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Template Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Game Type
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Description
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Active
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
                  .map((template) => {
                    const gameTypeLabel = getGameTypeDisplayName(template.gameType);
                    const style = GAME_TYPE_STYLES[template.gameType] || {
                      bg: "#f1f5f9",
                      color: "#475569",
                    };

                    return (
                      <TableRow
                        key={template.id}
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
                            {template.name}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={gameTypeLabel}
                            size="small"
                            sx={{
                              bgcolor: style.bg,
                              color: style.color,
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {template.description || "-"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Tooltip
                            title={template.active ? "Deactivate" : "Activate"}
                          >
                            <Switch
                              size="small"
                              color="success"
                              checked={template.active}
                              onChange={() => handleToggleActive(template)}
                            />
                          </Tooltip>
                        </TableCell>

                        <TableCell align="right">
                          <Tooltip title="Edit description">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(template)}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Template Description</DialogTitle>
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