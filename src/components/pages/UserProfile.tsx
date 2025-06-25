import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import {
  getStudentProfile,
  createStudentProfile,
  CreateStudentProfileDto,
  StudentProfile,
} from "@api/studentProfileApi";
import { getStudyPrograms, StudyProgram } from "@api/studyProgramApi";
import { UpdateUserMeDto, deleteUserMe, updateUserMe } from "@api/userApi";
import { useAuth } from "@hooks/useAuth";
import { showToast } from "@atoms/Toast";
import { ConfirmDialog } from "@atoms/ConfirmDialog";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { getRoleDisplayName } from "@enums/Role";
import { getCampusDisplayName } from "@enums/Campus";
import { Gender, getGenderDisplayName } from "@enums/Gender";

export const UserProfile: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [userEditMode, setUserEditMode] = React.useState(false);
  const [studentEditMode, setStudentEditMode] = React.useState(false);
  const [studentProfile, setStudentProfile] =
    React.useState<StudentProfile | null>(null);
  const [studyPrograms, setStudyPrograms] = React.useState<StudyProgram[]>([]);
  const [userData, setUserData] = React.useState<UpdateUserMeDto>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    gender: user?.gender || "",
  });
  const [formData, setFormData] = React.useState<CreateStudentProfileDto>({
    studyProgramId: "",
    yearOfStudy: "",
  });

  React.useEffect(() => {
    fetchStudyPrograms();
    if (user && user.role === "STUDENT") {
      fetchStudentProfile();
    }
  }, [user]);

  const fetchStudentProfile = async () => {
    try {
      const res = await getStudentProfile();
      setStudentProfile(res.data);
      setFormData({
        studyProgramId: res.data.studyProgramId || "",
        yearOfStudy: res.data.yearOfStudy || "",
      });
    } catch {
      setFormData({
        studyProgramId: "",
        yearOfStudy: "",
      });
    }
  };

  const fetchStudyPrograms = async () => {
    try {
      const res = await getStudyPrograms();
      setStudyPrograms(res.data);
    } catch (error) {
      console.error("Failed to fetch study programs", error);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearOfStudy" && value !== "" ? Number(value) : value,
    }));
  };

  const handleUserSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUserData: UpdateUserMeDto = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: userData.gender,
    };
    try {
      await updateUserMe(updatedUserData);
      showToast({ message: "User info updated", type: "success" });
      setUserEditMode(false);
    } catch (error) {
      console.error(error);
      showToast({ message: "Failed to update user info", type: "error" });
    }
  };

  const handleStudentProfileSave = async () => {
    try {
      await createStudentProfile(formData);
      showToast({ message: "Student profile saved", type: "success" });
      setStudentEditMode(false);
      fetchStudentProfile();
    } catch (error) {
      console.error("Error saving student profile", error);
      showToast({ message: "Failed to save student profile", type: "error" });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserMe();
      showToast({ message: "Account deleted", type: "success" });
      setOpen(false);
      logout();
    } catch (error) {
      console.error("Account deletion failed", error);
      showToast({ message: "Failed to delete account", type: "error" });
    } finally {
      navigate("/");
    }
  };

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
          {/* User Profile Card */}{" "}
          <Grid item>
            <Paper
              elevation={4}
              sx={{
                width: 400,
                padding: 4,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ marginBottom: 2 }}>
                User Profile
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleUserChange}
                    fullWidth
                    disabled={!userEditMode}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleUserChange}
                    fullWidth
                    disabled={!userEditMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    value={user.email}
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Gender"
                    name="gender"
                    value={userData.gender}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUserData((prev) => ({
                        ...prev,
                        gender:
                          value !== undefined && value !== null
                            ? (value as Gender)
                            : "",
                      }));
                    }}
                    disabled={!userEditMode}
                    fullWidth
                  >
                    {Object.values(Gender).map((g) => (
                      <MenuItem key={g} value={g}>
                        {getGenderDisplayName(g)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Role"
                    value={getRoleDisplayName(user.role)}
                    fullWidth
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                    marginTop: 16,
                  }}
                >
                  {userEditMode ? (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => setUserEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="contained" onClick={handleUserSave}>
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => setUserEditMode(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setOpen(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            {/* Student Profile Card */}
            {user?.role === "STUDENT" && (
              <Paper
                elevation={4}
                sx={{
                  width: 400,
                  padding: 4,
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ marginBottom: 2 }}>
                  Student Profile
                </Typography>

                {studentProfile || studentEditMode ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Study Program"
                        name="studyProgramId"
                        value={formData.studyProgramId}
                        onChange={handleStudentChange}
                        fullWidth
                        disabled={!studentEditMode}
                      >
                        <MenuItem value="">
                          <em>Select Study Program</em>
                        </MenuItem>
                        {studyPrograms.map((program) => (
                          <MenuItem key={program.id} value={program.id}>
                            {program.name}{" "}
                            {`(${getCampusDisplayName(program.campus)})`}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Start Year"
                        name="yearOfStudy"
                        value={formData.yearOfStudy || ""}
                        onChange={handleStudentChange}
                        fullWidth
                        disabled={!studentEditMode}
                      >
                        <MenuItem value="">
                          <em>Select Year</em>
                        </MenuItem>
                        {[...Array(4)].map((_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: "auto",
                          justifyContent: "flex-end",
                        }}
                      >
                        {studentEditMode ? (
                          <>
                            <Button
                              onClick={() => setStudentEditMode(false)}
                              variant="outlined"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleStudentProfileSave}
                            >
                              Save
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => setStudentEditMode(true)}
                          >
                            {studentProfile
                              ? "Edit Student Info"
                              : "Create Profile"}
                          </Button>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                ) : (
                  <>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                    >
                      No student profile available.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => setStudentEditMode(true)}
                      fullWidth
                    >
                      Add Student Profile
                    </Button>
                  </>
                )}
              </Paper>
            )}
          </Grid>
          <ConfirmDialog
            open={open}
            title="Delete Account"
            content="Are you sure you want to delete your account? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            confirmationWord="Delete"
            confirmationPrompt='Type "Delete" to confirm.'
            onClose={() => setOpen(false)}
            onConfirm={handleDeleteAccount}
          />
        </Grid>
      </div>
    </div>
  );
};
