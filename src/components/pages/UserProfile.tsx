import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useAuth } from "@hooks/useAuth";
import { showToast } from "@atoms/Toast";
import {
  deleteUserMe,
  updateUserMe,
  UpdateUserMeDto,
} from "@api/userApi";
import {
  getStudentProfile,
  updateStudentProfile,
  StudentProfile,
} from "@api/studentProfileApi";
import { getStudyPrograms, StudyProgram } from "@api/studyProgramApi";
import { Gender, getGenderDisplayName } from "@enums/Gender";
import { Role, getRoleDisplayName } from "@enums/Role";

interface UserDraft {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender | "";
}

interface StudentDraft {
  studyProgramId: number | "";
  yearOfStudy: number | "";
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1.5,
        gap: 2,
      }}
    >
      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "#1e293b", fontWeight: 500, textAlign: "right" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const [draft, setDraft] = React.useState<UserDraft>({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
  });

  const [studentProfile, setStudentProfile] = React.useState<StudentProfile | null>(
    null
  );
  const [studyPrograms, setStudyPrograms] = React.useState<StudyProgram[]>([]);
  const [studentDraft, setStudentDraft] = React.useState<StudentDraft>({
    studyProgramId: "",
    yearOfStudy: "",
  });

  const isStudent = user?.role === Role.STUDENT;

  React.useEffect(() => {
    if (!user) return;

    setDraft({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
    });
  }, [user]);

  React.useEffect(() => {
    const loadStudentData = async () => {
      if (!isStudent) {
        setStudentProfile(null);
        setStudyPrograms([]);
        setStudentDraft({ studyProgramId: "", yearOfStudy: "" });
        return;
      }

      try {
        const [profileRes, studyProgramsRes] = await Promise.all([
          getStudentProfile(),
          getStudyPrograms(),
        ]);

        const profile = profileRes.data;
        setStudentProfile(profile);
        setStudyPrograms(studyProgramsRes.data);
        setStudentDraft({
          studyProgramId: profile.studyProgramId,
          yearOfStudy: profile.yearOfStudy,
        });
      } catch (error) {
        console.error("Failed to load student profile data:", error);
        showToast({
          message: "Could not load student profile details",
          type: "warning",
        });
      }
    };

    loadStudentData();
  }, [isStudent]);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Typography sx={{ color: "#64748b" }}>
          Loading user profile...
        </Typography>
      </Container>
    );
  }

  const programNameById = new Map(
    studyPrograms.map((p) => [Number(p.id), p.name] as const)
  );

  const displayStudyProgram =
    studentProfile?.studyProgramId != null
      ? programNameById.get(studentProfile.studyProgramId) || "Unknown Program"
      : "-";

  const startEdit = () => {
    setDraft({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
    });

    if (studentProfile) {
      setStudentDraft({
        studyProgramId: studentProfile.studyProgramId,
        yearOfStudy: studentProfile.yearOfStudy,
      });
    }

    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
    });

    if (studentProfile) {
      setStudentDraft({
        studyProgramId: studentProfile.studyProgramId,
        yearOfStudy: studentProfile.yearOfStudy,
      });
    }

    setIsEditing(false);
  };

  const updateField = (field: keyof UserDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value as UserDraft[typeof field] }));
  };

  const saveEdit = async () => {
    if (!draft.firstName.trim() || !draft.lastName.trim()) {
      showToast({ message: "First name and last name are required", type: "warning" });
      return;
    }

    setSaving(true);
    try {
      const payload: UpdateUserMeDto = {
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        gender: draft.gender,
      };

      await updateUserMe(payload);

      if (isStudent && studentProfile) {
        await updateStudentProfile({
          studyProgramId: studentDraft.studyProgramId,
          yearOfStudy: studentDraft.yearOfStudy,
        });
      }

      showToast({
        message: "Profile updated. Reloading account data...",
        type: "success",
      });

      setIsEditing(false);
      navigate(0);
    } catch (error) {
      console.error("Failed to save profile:", error);
      showToast({ message: "Failed to update profile", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteUserMe();
      showToast({ message: "Account deleted successfully", type: "success" });
      logout();
      navigate("/home");
    } catch (error) {
      console.error("Failed to delete account:", error);
      showToast({ message: "Failed to delete account", type: "error" });
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9" }}>
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <PersonIcon sx={{ color: "#7c3aed", fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
            My Profile
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box
            sx={{
              backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2.5,
            }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: "#f97316",
                fontSize: "1.75rem",
                fontWeight: 700,
              }}
            >
              {user.firstName[0]}
              {user.lastName[0]}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Chip
                label={getRoleDisplayName(user.role)}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                  mt: 0.5,
                }}
              />
            </Box>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="overline" sx={{ color: "#94a3b8", fontWeight: 700 }}>
                Account Information
              </Typography>
              {!isEditing && (
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={startEdit}
                  sx={{ color: "#7c3aed", fontWeight: 600 }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            {!isEditing && (
              <Box>
                <InfoRow label="First Name" value={user.firstName} />
                <Divider />
                <InfoRow label="Last Name" value={user.lastName} />
                <Divider />
                <InfoRow label="Email" value={user.email} />
                <Divider />
                <InfoRow label="Gender" value={getGenderDisplayName(user.gender)} />
                <Divider />
                <InfoRow label="Role" value={getRoleDisplayName(user.role)} />

                {isStudent && (
                  <>
                    <Typography
                      variant="overline"
                      sx={{ color: "#94a3b8", fontWeight: 700, display: "block", mt: 3 }}
                    >
                      Student Profile
                    </Typography>
                    <InfoRow label="Study Program" value={displayStudyProgram} />
                    <Divider />
                    <InfoRow
                      label="Start Year"
                      value={String(studentProfile?.yearOfStudy ?? "-")}
                    />
                  </>
                )}
              </Box>
            )}

            {isEditing && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="First Name"
                    value={draft.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Last Name"
                    value={draft.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Box>

                <TextField label="Email" value={draft.email} fullWidth size="small" disabled />

                <TextField
                  label="Gender"
                  select
                  value={draft.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value={Gender.MALE}>Male</MenuItem>
                  <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                  <MenuItem value={Gender.UNIDENTIFIED}>Unidentified</MenuItem>
                </TextField>

                {isStudent && (
                  <>
                    <TextField
                      label="Study Program"
                      select
                      value={studentDraft.studyProgramId}
                      onChange={(e) =>
                        setStudentDraft((prev) => ({
                          ...prev,
                          studyProgramId: Number(e.target.value),
                        }))
                      }
                      fullWidth
                      size="small"
                    >
                      {studyPrograms.map((program) => (
                        <MenuItem key={program.id} value={Number(program.id)}>
                          {program.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Start Year"
                      type="number"
                      value={studentDraft.yearOfStudy}
                      onChange={(e) =>
                        setStudentDraft((prev) => ({
                          ...prev,
                          yearOfStudy: Number(e.target.value),
                        }))
                      }
                      fullWidth
                      size="small"
                    />
                  </>
                )}

                <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={saveEdit}
                    disabled={saving}
                    sx={{ bgcolor: "#7c3aed", "&:hover": { bgcolor: "#6d28d9" }, fontWeight: 600 }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    onClick={cancelEdit}
                    disabled={saving}
                    sx={{ color: "#64748b", borderColor: "#cbd5e1", fontWeight: 600 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, mt: 3, border: "1px solid #fecaca" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="overline" sx={{ color: "#ef4444", fontWeight: 700 }}>
              Danger Zone
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  Delete Account
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  Permanently remove your account and all associated data.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={() => setDeleteOpen(true)}
                sx={{ fontWeight: 600, flexShrink: 0 }}
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete your account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Your account and all associated data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            sx={{ color: "#64748b", fontWeight: 600 }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error" sx={{ fontWeight: 600 }} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};