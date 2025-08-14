import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios"; // ✅ Added

const ViewPatientAdmitTable = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/patients/admitted");
        setPatients(res.data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    const updated = patients.filter((patient) => patient.id !== id);
    setPatients(updated);
    // Optional: Call backend delete endpoint here
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setStatus(patient.status);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    const updated = patients.map((p) =>
      p.id === selectedPatient.id ? { ...p, status } : p
    );
    setPatients(updated);
    setEditOpen(false);
    // Optional: call backend PUT API here
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
          bgcolor: "background.default",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: "primary.main", textAlign: "center" }}
        >
          🏥 Admitted Patients
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Patient Name</strong></TableCell>
                  <TableCell><strong>Room</strong></TableCell>
                  <TableCell><strong>Admitted On</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.id}</TableCell>
                    <TableCell>{patient.patientName}</TableCell>
                    <TableCell>{patient.room}</TableCell>
                    <TableCell>{patient.admittedOn}</TableCell>
                    <TableCell>{patient.status}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Status">
                        <IconButton onClick={() => handleEditClick(patient)} color="primary">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Patient">
                        <IconButton onClick={() => handleDelete(patient.id)} color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {patients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No patients admitted.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Patient Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="In Hospital">In Hospital</MenuItem>
              <MenuItem value="Left">Left</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewPatientAdmitTable;
