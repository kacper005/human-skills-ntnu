import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import {
  addStudyProgram,
  CreateStudyProgramDto,
  getStudyPrograms,
  StudyProgram,
  updateStudyProgram,
  deleteStudyProgram,
} from "@api/studyProgramApi";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { Campus, getCampusDisplayName } from "@enums/Campus";
import { getStudyLevelDisplayName, StudyLevel } from "@enums/StudyLevel";

export const AdminStudyPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<StudyProgram | null>(
    null
  );
  const [formData, setFormData] = useState<CreateStudyProgramDto>({
    name: "",
    campus: Campus.AALESUND,
    studyLevel: StudyLevel.BACHELOR,
  });

  const fetchPrograms = async () => {
    try {
      const response = await getStudyPrograms();
      setPrograms(response.data);
    } catch (error) {
      console.error("Failed to fetch study programs", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPrograms();
  }, []);

  const filtered = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      getCampusDisplayName(p.campus)
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const openAddDialog = () => {
    setIsEdit(false);
    setFormData({
      name: "",
      campus: Campus.AALESUND,
      studyLevel: StudyLevel.BACHELOR,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (program: StudyProgram) => {
    setSelectedProgram(program);
    setFormData({
      name: program.name,
      campus: program.campus,
      studyLevel: program.studyLevel,
    });
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isEdit && selectedProgram) {
        await updateStudyProgram(selectedProgram.id, formData);
        showToast({
          message: "Study program updated successfully!",
          type: "success",
        });
      } else {
        await addStudyProgram(formData);
        showToast({
          message: "Study program added successfully!",
          type: "success",
        });
      }
      setDialogOpen(false);
      fetchPrograms();
    } catch (error) {
      showToast({ message: "Failed to save study program", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (selectedProgram) {
      try {
        await deleteStudyProgram(selectedProgram.id);
        showToast({
          message: "Study program deleted successfully!",
          type: "success",
        });
        setDialogOpen(false);
        fetchPrograms();
      } catch (error) {
        showToast({
          message: "Failed to delete study program",
          type: "error",
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "campus"
          ? (value as Campus)
          : name === "studyLevel"
            ? (value as StudyLevel)
            : value,
    });
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
              bgcolor: "#ede9fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7c3aed",
            }}
          >
            <SchoolIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#1e293b" }}
            >
              Study Programs
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Create and manage study programs, curricula, and learning paths
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Search programs..."
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
          sx={{
            bgcolor: "#7c3aed",
            "&:hover": { bgcolor: "#6d28d9" },
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add New Study Program
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Program Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Campus
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Level
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
                    <FolderOpenIcon
                      sx={{
                        fontSize: 48,
                        color: "#cbd5e1",
                        mb: 1,
                        display: "block",
                        mx: "auto",
                      }}
                    />
                    <Typography variant="body1" sx={{ color: "#94a3b8" }}>
                      No study programs found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((program) => (
                    <TableRow
                      key={program.id}
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
                          {program.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#475569" }}>
                          {getCampusDisplayName(program.campus)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#475569" }}>
                          {getStudyLevelDisplayName(program.studyLevel)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(program)}
                          sx={{
                            color: "#64748b",
                            "&:hover": { color: "#7c3aed" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
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
        <DialogTitle>
          {isEdit ? "Edit Study Program" : "Add Study Program"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
            autoFocus
          />
          <TextField
            select
            label="Campus"
            name="campus"
            value={formData.campus}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            {Object.values(Campus).map((campus) => (
              <MenuItem key={campus} value={campus}>
                {getCampusDisplayName(campus)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Study Level"
            name="studyLevel"
            value={formData.studyLevel}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            {Object.values(StudyLevel).map((level) => (
              <MenuItem key={level} value={level}>
                {getStudyLevelDisplayName(level)}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          {isEdit && (
            <Button variant="contained" onClick={handleDelete} color="error">
              Delete
            </Button>
          )}
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};