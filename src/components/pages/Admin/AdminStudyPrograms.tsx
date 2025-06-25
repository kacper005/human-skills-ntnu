import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  addStudyProgram,
  CreateStudyProgramDto,
  getStudyPrograms,
  StudyProgram,
} from "@api/studyProgramApi";
import { updateStudyProgram, deleteStudyProgram } from "@api/studyProgramApi";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { Column, GenericTable } from "@organisms/GenericTable";
import { Campus, getCampusDisplayName } from "@enums/Campus";
import { getStudyLevelDisplayName, StudyLevel } from "@enums/StudyLevel";

const columns: Column<StudyProgram>[] = [
  { id: "name", label: "Program Name", minWidth: 150 },
  {
    id: "campus",
    label: "Campus",
    minWidth: 120,
    format: (value) => getCampusDisplayName(value),
  },
  {
    id: "studyLevel",
    label: "Level",
    minWidth: 100,
    format: (value) => getStudyLevelDisplayName(value),
  },
];

export const AdminStudyPrograms: React.FC = () => {
  const [programs, setPrograms] = React.useState<StudyProgram[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [selectedProgram, setSelectedProgram] =
    React.useState<StudyProgram | null>(null);
  const [formData, setFormData] = React.useState<CreateStudyProgramDto>({
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

  const filteredPrograms = programs.filter((program) =>
    `${program.name} ${program.campus} ${program.studyLevel}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  React.useEffect(() => {
    fetchPrograms();
  }, []);

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
        showToast({ message: "Failed to delete study program", type: "error" });
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
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          marginBottom: 16,
        }}
      >
        <Button variant="contained" color="primary" onClick={openAddDialog}>
          Add New Study Program
        </Button>
      </div>

      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: "100%", mt: 1, mb: 1 }}
      />

      <GenericTable
        columns={columns}
        rows={filteredPrograms}
        onRowClick={openEditDialog}
      />

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
    </div>
  );
};
