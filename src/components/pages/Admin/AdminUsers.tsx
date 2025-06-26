import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { getUsers, updateUserRole, UpdateUserDto, User } from "@api/userApi";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { GenericTable } from "@organisms/GenericTable";
import { getRoleDisplayName, Role } from "@enums/Role";

const columns: {
  id: keyof User;
  label: string;
  minWidth: number;
  format?: (value: any) => React.ReactNode;
}[] = [
  { id: "email", label: "Email", minWidth: 200 },
  { id: "firstName", label: "First Name", minWidth: 150 },
  { id: "lastName", label: "Last Name", minWidth: 150 },
  {
    id: "role",
    label: "Role",
    minWidth: 100,
    format: (value) => getRoleDisplayName(value),
  },
];

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UpdateUserDto | null>(
    null
  );
  const [formData, setFormData] = React.useState<UpdateUserDto>({
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

  const openEditDialog = (user: UpdateUserDto) => {
    setSelectedUser(user);
    setFormData({
      id: user.id,
      role: user.role,
    });
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isEdit && selectedUser) {
        await updateUserRole(formData.id, formData.role);
        showToast({
          message: "User updated successfully!",
          type: "success",
        });
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
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Users
      </Typography>
      <GenericTable
        columns={columns}
        rows={users}
        onRowClick={openEditDialog}
      />

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
    </div>
  );
};
