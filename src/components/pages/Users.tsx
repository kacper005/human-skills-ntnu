import React from "react";
import { GenericTable } from "../organisms/GenericTable";
import { getUsers, UpdateUserDto, User } from "../../api/userApi";
import { getRoleDisplayName } from "../../enums/Role";

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

export const Users: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UpdateUserDto | null>(
    null
  );
  const [formData, setFormData] = React.useState<UpdateUserDto>({
    firstName: "",
    lastName: "",
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
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
    });
    setIsEdit(true);
    setDialogOpen(true);
  };

  return <GenericTable columns={columns} rows={users} />;
};
