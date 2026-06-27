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
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import {
  GameTemplate,
  getAllGameTemplates,
  updateGameTemplateDescription,
} from "@api/gameTemplate";

const GAME_TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  ATTENTION: { bg: "#ede9fe", color: "#7c3aed" },
  BALLOON: { bg: "#fce7f3", color: "#db2777" },
  COGFLEX: { bg: "#ecfdf5", color: "#059669" },
  INT_FLUID: { bg: "#e0f2fe", color: "#0369a1" },
};

const formatGameType = (type?: string) => {
  if (!type) return "-";
  return type
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? "-"
    : parsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

export const AdminGameTemplates: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<GameTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(
    null
  );
  const [description, setDescription] = useState("");

  const fetchAllTemplates = async () => {
    try {
      const res = await getAllGameTemplates();
      setTemplates(res.data || []);
    } catch (err: any) {
      showToast({
        message:
          err?.response?.data?.message || "Failed to fetch game templates",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllTemplates();
  }, []);

  const filtered = templates.filter((template) => {
    const name = (template.name || "").toLowerCase();
    const gameType = String(template.gameType || "").toLowerCase();
    const query = search.toLowerCase();

    return name.includes(query) || gameType.includes(query);
  });

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
    } catch (err: any) {
      showToast({
        message:
          err?.response?.data?.message || "Failed to update game template",
        type: "error",
      });
    }
  };

  if (loading) return <LoadingSpinner />;

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
                  Active
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Updated At
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
                    const gameTypeRaw = String(template.gameType || "");
                    const gameTypeLabel = formatGameType(gameTypeRaw);
                    const style =
                      GAME_TYPE_STYLES[gameTypeRaw.toUpperCase()] || {
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
                            {template.name || "Template #" + template.id}
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
                          <Chip
                            label={template.active ? "Active" : "Inactive"}
                            size="small"
                            sx={{
                              bgcolor: template.active ? "#f0fdf4" : "#f1f5f9",
                              color: template.active ? "#16a34a" : "#64748b",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {formatDate(template.updatedAt || template.createdAt)}
                          </Typography>
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