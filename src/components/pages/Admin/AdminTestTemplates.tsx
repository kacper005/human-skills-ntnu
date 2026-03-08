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
import QuizIcon from "@mui/icons-material/Quiz";
import InboxIcon from "@mui/icons-material/Inbox";
import {
  getAllTestTemplates,
  TestTemplate,
  updateTestTemplateDescription,
} from "@api/testTemplate";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { getTestTypeDisplayName } from "@enums/TestType";
import { getTestOptionTypeDisplayName } from "@enums/TestOptionType";

const OPTION_TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  "Likert Scale": { bg: "#fef3c7", color: "#d97706" },
  "Multiple Choice": { bg: "#e0e7ff", color: "#4338ca" },
};

export const AdminTestTemplates: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [testTemplates, setTestTemplates] = useState<TestTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTestTemplate, setSelectedTestTemplate] =
    useState<TestTemplate | null>(null);
  const [description, setDescription] = useState("");

  const fetchAllTestTemplates = async () => {
    try {
      const response = await getAllTestTemplates();
      setTestTemplates(response.data || []);
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Failed to fetch test data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllTestTemplates();
  }, []);

  const filtered = testTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      getTestTypeDisplayName(t.testType)
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const openEditDialog = (template: TestTemplate) => {
    setSelectedTestTemplate(template);
    setDescription(template.description || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedTestTemplate) {
        await updateTestTemplateDescription(
          selectedTestTemplate.id,
          description
        );
        showToast({
          message: "Test template updated successfully!",
          type: "success",
        });
      }
      setDialogOpen(false);
      fetchAllTestTemplates();
    } catch (error) {
      showToast({ message: "Failed to update test template", type: "error" });
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
              bgcolor: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3b82f6",
            }}
          >
            <QuizIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#1e293b" }}
            >
              Test Templates
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              View and manage psychometric test templates
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Actions Bar */}
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

      {/* Table */}
      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Template Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Test Type
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Option Type
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
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
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
                      No test templates found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((template) => {
                    const optionTypeDisplay = getTestOptionTypeDisplayName(
                      template.optionType
                    );
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
                          <Typography
                            variant="body2"
                            sx={{ color: "#475569" }}
                          >
                            {getTestTypeDisplayName(template.testType)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={optionTypeDisplay}
                            size="small"
                            sx={{
                              bgcolor:
                                OPTION_TYPE_STYLES[optionTypeDisplay]?.bg ||
                                "#f1f5f9",
                              color:
                                OPTION_TYPE_STYLES[optionTypeDisplay]?.color ||
                                "#475569",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit description">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(template)}
                              sx={{
                                color: "#64748b",
                                "&:hover": { color: "#3b82f6" },
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
        <DialogTitle>Edit Test Description</DialogTitle>
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