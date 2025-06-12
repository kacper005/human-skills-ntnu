import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { getRoleDisplayName } from "../../enums/Role";
import {
  getStudentProfile,
  createStudentProfile,
  CreateStudentProfileDto,
  StudentProfile,
} from "../../api/studentProfileApi";
import { getStudyPrograms, StudyProgram } from "../../api/studyProgramApi";
import { showToast } from "../atoms/Toast";
import { UpdateUserDto, updateUserMe } from "../../api/userApi";
import { Gender, getGenderDisplayName } from "../../enums/Gender";

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [userEditMode, setUserEditMode] = React.useState(false);
  const [studentEditMode, setStudentEditMode] = React.useState(false);

  const [studentProfile, setStudentProfile] =
    React.useState<StudentProfile | null>(null);
  const [studyPrograms, setStudyPrograms] = React.useState<StudyProgram[]>([]);

  const [userData, setUserData] = React.useState<UpdateUserDto>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    gender: user?.gender ?? undefined,
  });

  const [formData, setFormData] = React.useState<CreateStudentProfileDto>({
    studyProgramId: 0,
    yearsOfStudy: 1,
  });

  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    } else if (user) {
      setUserData({
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
      });
      fetchStudentProfile();
      fetchStudyPrograms();
    }
  }, [loading, user, navigate]);

  const fetchStudentProfile = async () => {
    try {
      const res = await getStudentProfile();
      setStudentProfile(res.data);
      setFormData({
        studyProgramId: res.data.studyProgramId,
        yearsOfStudy: res.data.yearsOfStudy,
      });
    } catch {
      console.warn("No student profile found.");
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
      [name]: value,
    }));
  };

  const handleUserSave = async () => {
    try {
      if (user) {
        const updated = await updateUserMe(userData);
        setUserData({
          firstName: updated.data.firstName,
          lastName: updated.data.lastName,
          gender: updated.data.gender,
        });
      }
      showToast({ message: "User info updated", type: "success" });
      setUserEditMode(false);
    } catch (err) {
      console.error(err);
      showToast({ message: "Failed to update user info", type: "error" });
    }
  };

  const handleStudentSave = async () => {
    console.log("Saving student profile with data:", formData);
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

  if (loading || !user) {
    return (
      <div>
        <CircularProgress />
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Grid container spacing={4} justifyContent="center">
          {/* User Profile Card */}{" "}
          <Grid item>
            <Paper
              elevation={4}
              sx={{ width: 400, padding: 4, borderRadius: 3 }}
            >
              <Typography variant="h5" gutterBottom>
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
                    value={userData.gender || ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        gender: e.target.value as Gender,
                      })
                    }
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
              <div>
                {userEditMode ? (
                  <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                    <Button onClick={() => setUserEditMode(false)}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleUserSave}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setUserEditMode(true)}
                    sx={{ mt: 2 }}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </Paper>
          </Grid>
          <Grid item>
            {/* Student Profile Card */}
            <Paper
              elevation={4}
              sx={{ width: 400, padding: 4, borderRadius: 3 }}
            >
              <Typography variant="h5" gutterBottom>
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
                      {studyPrograms.map((program) => (
                        <MenuItem key={program.id} value={program.id}>
                          {program.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Year of Study"
                      name="yearsOfStudy"
                      type="number"
                      value={formData.yearsOfStudy}
                      onChange={handleStudentChange}
                      fullWidth
                      disabled={!studentEditMode}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
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
                            onClick={handleStudentSave}
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
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
