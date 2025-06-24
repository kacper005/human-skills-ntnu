import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { getAllTeachers, Teacher } from "@api/userApi.ts";
import {
  addStudentTeacherRelation,
  deleteStudentTeacherRelation,
  getStudentTeacherRelationsBySessionId,
} from "@api/studentTeacher.ts";
import { showToast } from "@atoms/Toast.tsx";
import { LoadingSpinner } from "@atoms/LoadingSpinner.tsx";

type ShareDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  testSessionId: number;
};

export const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  title,
  onClose,
  testSessionId,
}) => {
  const [_, setTeachers] = React.useState<Teacher[]>([]);
  const [sharedTeachers, setSharedTeachers] = React.useState<Teacher[]>([]);
  const [availableTeachers, setAvailableTeachers] = React.useState<Teacher[]>(
    []
  );
  const [selectedTeacherId, setSelectedTeacherId] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const loadTeachersAndRelations = async () => {
    try {
      setLoading(true);

      const [allTeachersRes, relationsRes] = await Promise.all([
        getAllTeachers(),
        getStudentTeacherRelationsBySessionId(testSessionId),
      ]);

      const allTeachers: Teacher[] = allTeachersRes.data;
      const relations = relationsRes.data;

      const shared = allTeachers.filter((teacher: Teacher) =>
        relations.some((rel) => rel.teacherEmail === teacher.teacherEmail)
      );

      const available = allTeachers.filter(
        (teacher: Teacher) =>
          !shared.some((st) => st.teacherEmail === teacher.teacherEmail)
      );

      setTeachers(allTeachers);
      setSharedTeachers(shared);
      setAvailableTeachers(available);
    } catch (error) {
      console.error("Error loading data", error);
      showToast({ message: "Failed to load teachers", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open && testSessionId) {
      loadTeachersAndRelations();
    }
  }, [open, testSessionId]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedTeacherId(event.target.value);
  };

  const handleAddTeacher = async () => {
    const teacherToAdd = availableTeachers.find(
      (t) => t.teacherId.toString() === selectedTeacherId
    );
    if (!teacherToAdd) return;

    try {
      await addStudentTeacherRelation({
        teacherId: teacherToAdd.teacherId,
        testSessionId,
      });

      setSharedTeachers((prev) => [...prev, teacherToAdd]);
      setAvailableTeachers((prev) =>
        prev.filter((t) => t.teacherId !== teacherToAdd.teacherId)
      );
      setSelectedTeacherId("");
      showToast({ message: "Teacher added successfully", type: "success" });
    } catch (error) {
      console.error("Error adding teacher", error);
      showToast({ message: "Failed to share session", type: "error" });
    }
  };

  const handleRemoveTeacher = async (teacherId: number) => {
    try {
      const relations = await getStudentTeacherRelationsBySessionId(
        testSessionId
      );

      console.log("Relations to check:", relations.data);
      const teacher = sharedTeachers.find((t) => t.teacherId === teacherId);
      if (!teacher) {
        showToast({ message: "Teacher not found", type: "error" });
        return;
      }

      const relation = relations.data.find(
        (r) => r.teacherEmail === teacher.teacherEmail
      );

      console.log("Relation to remove:", relation);

      if (!relation) {
        showToast({ message: "Relation not found", type: "error" });
        return;
      }

      await deleteStudentTeacherRelation(relation.relationId);

      const removed = sharedTeachers.find((t) => t.teacherId === teacherId);
      if (removed) {
        setAvailableTeachers((prev) => [...prev, removed]);
      }

      setSharedTeachers((prev) =>
        prev.filter((t) => t.teacherId !== teacherId)
      );

      showToast({ message: "Teacher removed successfully", type: "success" });
    } catch (error) {
      console.error("Error removing teacher", error);
      showToast({ message: "Failed to remove teacher", type: "error" });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {/* Select + Add Button */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="select-teacher-label">
                Select a Teacher
              </InputLabel>
              <Select
                labelId="select-teacher-label"
                value={selectedTeacherId}
                onChange={handleChange}
                label="Select a Teacher"
              >
                {availableTeachers.length === 0 ? (
                  <MenuItem disabled>No teachers available</MenuItem>
                ) : (
                  availableTeachers.map((teacher) => (
                    <MenuItem
                      key={teacher.teacherId}
                      value={teacher.teacherId.toString()}
                    >
                      {teacher.teacherName} ({teacher.teacherEmail})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              sx={{ width: "100%", height: "56px", mt: 1 }}
              onClick={handleAddTeacher}
              disabled={!selectedTeacherId}
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {/* Shared Teachers List */}
        <DialogContentText sx={{ mt: 5 }}>
          Teachers who can view this test session:
        </DialogContentText>

        <Grid container spacing={2} direction="column" sx={{ mt: 2 }}>
          {sharedTeachers.map((teacher) => (
            <Grid
              key={teacher.teacherId}
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                p: 2,
                mb: 1,
              }}
            >
              <Box>
                <DialogContentText fontWeight="bold" sx={{ mb: 0.5 }}>
                  {teacher.teacherName}
                </DialogContentText>
                <DialogContentText>{teacher.teacherEmail}</DialogContentText>
              </Box>
              <Button
                variant="outlined"
                color="error"
                sx={{
                  minWidth: "40px",
                  minHeight: "40px",
                  p: 1,
                  ml: 2,
                }}
                onClick={() => handleRemoveTeacher(teacher.teacherId)}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
