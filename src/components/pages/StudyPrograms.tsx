import React from "react";
import {
  addStudyProgram,
  CreateStudyProgramDto,
  getStudyPrograms,
  StudyProgram,
} from "../../api/studyProgramApi";
import { Column, GenericTable } from "../organisms/GenericTable";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { getStudyLevelDisplayName, StudyLevel } from "../../enums/StudyLevel";
import { Campus, getCampusDisplayName } from "../../enums/Campus";
import {
  updateStudyProgram,
  deleteStudyProgram,
} from "../../api/studyProgramApi";
import { showToast } from "../atoms/Toast";

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

export const StudyPrograms: React.FC = () => {
  const [programs, setPrograms] = React.useState<StudyProgram[]>([]);
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

  if (loading) return <p>Loading study programs...</p>;

  return (
    <div style={{ padding: 16 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={openAddDialog}
        sx={{ mb: 2 }}
      >
        Add New Study Program
      </Button>

      <GenericTable
        columns={columns}
        rows={programs}
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
          {isEdit && (
            <Button variant="outlined" onClick={handleDelete} color="error">
              Delete
            </Button>
          )}
          <Button variant="outlined" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
