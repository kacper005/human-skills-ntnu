import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    MenuItem, Select, InputLabel, FormControl, Grid2, SelectChangeEvent, Box,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {getTeachers, Teacher} from "@api/userApi.ts";
import {showToast} from "@atoms/Toast.tsx";
import {LoadingSpinner} from "@atoms/LoadingSpinner.tsx";

type ShareDialogueProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    onAddTeacher?: () => void;
    onRemoveTeacher?: () => void;
}

export const ShareDialog: React.FC<ShareDialogueProps> = ({
    open,
    title,
    onClose,
                               }) => {
    const [teachers, setTeachers] = React.useState<Teacher[]>([]);
    const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchAllTeachers = async () => {
            try {
                const response = await getTeachers();
                console.log("Teachers fetched successfully:", response.data);
                setTeachers(response.data);
            } catch (error) {
                console.error("Error fetching teachers:", error);
                showToast({ message: "Could not load teachers", type: "error" });
            } finally {
                setLoading(false);
            }
        }

        fetchAllTeachers();
    }, []);

    const handleChange = (event: SelectChangeEvent<number>) => {
        const selectedTeacherId = Number(event.target.value);
        console.log(selectedTeacherId);
        const selectedTeacher = teachers.find((teacher) => teacher.id === selectedTeacherId);
        console.log(selectedTeacher);
        setSelectedTeacher(selectedTeacher);
    };

    if (loading) {
        return <Box></Box>;
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <Grid2 container spacing={2} alignItems={"center"} margin={"sm"} justifyContent="space-between">
                    <Grid2 size={9} item>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label" key={selectedTeacher?.id}>
                                {selectedTeacher ? selectedTeacher.teacherName : "Select a Teacher"}
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedTeacher?.id ?? ""}
                                label="Teachers"
                                onChange={handleChange}
                            >
                                {teachers.map((teacher) => (
                                    <MenuItem key={teacher.id + ""} value={teacher.id}>
                                        {teacher.teacherName} ({teacher.teacherEmail})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 item>
                        <Button variant="contained" sx={{ width: 100, height: 55}}>
                            Add
                        </Button>
                    </Grid2>
                </Grid2>

                <DialogContentText marginTop={5}>
                    Teachers can view this test session:
                </DialogContentText>

                <Grid2 container spacing={2} flexDirection="column" sx={{ marginTop: 2 }} justifyContent="center">
                    <Grid2 item display="flex" alignItems="center" gap={2} justifyContent="space-between">
                        <DialogContentText fontWeight="bold">TeacherName</DialogContentText>
                        <DialogContentText>Teacher@Teacher.com</DialogContentText>
                        <Button variant="outlined" color="error">
                            <DeleteIcon></DeleteIcon>
                        </Button>
                    </Grid2>
                </Grid2>


            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog>


    )
}