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
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { getUsers, updateUserRole, UpdateUserDto, User } from "@api/userApi";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { getRoleDisplayName, Role } from "@enums/Role";

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  Administrator: { bg: "#fef3c7", color: "#d97706" },
  Teacher: { bg: "#ede9fe", color: "#7c3aed" },
  Student: { bg: "#eff6ff", color: "#3b82f6" },
};

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getAvatarColor(role: string) {
  const colors: Record<string, string> = {
    Administrator: "#d97706",
    Teacher: "#7c3aed",
    Student: "#3b82f6",
  };
  return colors[role] || "#64748b";
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UpdateUserDto | null>(null);
  const [formData, setFormData] = useState<UpdateUserDto>({
    id: 0,
    role: Role.STUDENT,
  });

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase())
  );

  const openEditDialog = (user: User) => {
    setSelectedUser({ id: user.id, role: user.role });
    setFormData({ id: user.id, role: user.role });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedUser) {
        await updateUserRole(formData.id, formData.role);
        showToast({ message: "User updated successfully!", type: "success" });
      }
      setDialogOpen(false);
    } catch (error) {
      showToast({ message: "Failed to update user", type: "error" });
    } finally {
      fetchUsers();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as Role;
    setFormData((prev) => ({ ...prev, role: value }));
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
              bgcolor: "#fff7ed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f97316",
            }}
          >
            <PeopleIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#1e293b" }}
            >
              Users
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Manage user accounts, roles, and permissions
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Actions Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search users..."
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
                  User
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Role
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
                    <PersonOffIcon
                      sx={{
                        fontSize: 48,
                        color: "#cbd5e1",
                        mb: 1,
                        display: "block",
                        mx: "auto",
                      }}
                    />
                    <Typography variant="body1" sx={{ color: "#94a3b8" }}>
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => {
                    const roleDisplay = getRoleDisplayName(user.role);
                    return (
                      <TableRow
                        key={user.id}
                        sx={{
                          "&:hover": { bgcolor: "#fafafa" },
                          transition: "background-color 0.15s",
                        }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: getAvatarColor(roleDisplay),
                                fontSize: "0.8rem",
                                fontWeight: 700,
                              }}
                            >
                              {getInitials(user.firstName, user.lastName)}
                            </Avatar>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "#1e293b" }}
                            >
                              {user.firstName} {user.lastName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "#475569" }}
                          >
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={roleDisplay}
                            size="small"
                            sx={{
                              bgcolor: ROLE_STYLES[roleDisplay]?.bg || "#f1f5f9",
                              color:
                                ROLE_STYLES[roleDisplay]?.color || "#475569",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Change role">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(user)}
                              sx={{
                                color: "#64748b",
                                "&:hover": { color: "#f97316" },
                              }}
                            >
                              <AdminPanelSettingsIcon fontSize="small" />
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

      {/* Edit Role Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            margin="dense"
          >
            {Object.values(Role).map((role) => (
              <MenuItem key={role} value={role}>
                {getRoleDisplayName(role)}
              </MenuItem>
            ))}
          </TextField>
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