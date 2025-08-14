import React, {useEffect, useState} from "react";
import axios from "axios";
import {
  Box,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication failed.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
            "http://localhost:8080/hospital/api/appointments/all",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
        );

        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (err) {
        console.error("Error fetching appointments:", err.message);
        setError("Could not load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter on search
  useEffect(() => {
    const filtered = appointments.filter((appt) =>
        Object.values(appt).some(
            (val) =>
                val &&
                val.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setFilteredAppointments(filtered);
  }, [searchQuery, appointments]);

  // Map status to color
  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return { bgcolor: "#4caf50", color: "#fff" }; // Green
      case "PENDING":
        return { bgcolor: "#ff9800", color: "#fff" }; // Amber
      case "CANCELLED":
        return { bgcolor: "#f44336", color: "#fff" }; // Red
      case "COMPLETED":
        return { bgcolor: "#2196f3", color: "#fff" }; // Blue
      default:
        return { bgcolor: "#9e9e9e", color: "#fff" }; // Gray
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteDialogOpen(true);
  };

  // Handle delete appointment
  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) {
      setSnackbar({ open: true, message: "No appointment selected for deletion", severity: "error" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbar({ open: true, message: "Authentication failed", severity: "error" });
        setDeleteDialogOpen(false);
        setAppointmentToDelete(null);
        return;
      }

      console.log("Attempting to delete appointment:", appointmentToDelete);
      console.log("Appointment ID:", appointmentToDelete.id);
      
      // Ensure the ID is clean (remove any extra characters)
      const appointmentId = String(appointmentToDelete.id).trim();
      const deleteUrl = `http://localhost:8080/hospital/api/appointments/${appointmentId}`;
      
      console.log("Delete URL:", deleteUrl);
      
      const response = await axios.delete(deleteUrl, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      console.log("Delete response:", response);

      // Update local state
      const updatedAppointments = appointments.filter(appt => appt.id !== appointmentToDelete.id);
      setAppointments(updatedAppointments);
      
      // Re-filter the updated appointments
      const newFilteredAppointments = updatedAppointments.filter((appt) =>
        Object.values(appt).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredAppointments(newFilteredAppointments);

      setDeleteDialogOpen(false);
      setAppointmentToDelete(null);
      setSnackbar({ open: true, message: "Appointment deleted successfully!", severity: "success" });
      
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error deleting appointment:", err.message);
      console.error("Error response data:", err.response?.data);
      console.error("Error response status:", err.response?.status);
      console.error("Error response headers:", err.response?.headers);
      console.error("Error config:", err.config);
      
      let errorMessage = "Failed to delete appointment";
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const data = err.response.data;
        
        switch (status) {
          case 400:
            errorMessage = data?.message || "Bad request - Invalid appointment ID";
            break;
          case 401:
            errorMessage = "Authentication failed - Please login again";
            break;
          case 403:
            errorMessage = "Permission denied - You don't have access to delete appointments";
            break;
          case 404:
            errorMessage = "Appointment not found - It may have been already deleted";
            break;
          case 500:
            errorMessage = data?.message || "Server error - Please try again later";
            break;
          default:
            errorMessage = data?.message || `Server error (${status})`;
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error - Please check your connection";
      } else {
        // Other error
        errorMessage = err.message || "An unexpected error occurred";
      }
      
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
      setDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Title */}
          <Typography variant="h4" align="center" gutterBottom className="text-3xl font-bold text-gray-800 mb-8">
            Manage Appointments
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 700, marginX: "auto", mb: 4 }}>
            <TextField
                fullWidth
                placeholder="Search by patient, email, doctor, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                  ),
                }}
                sx={{
                  bgcolor: "#ffffffdd",
                  borderRadius: 2,
                  boxShadow: 2,
                  "& .MuiInputBase-root": {
                    borderRadius: "12px",
                    backgroundColor: "white",
                  },
                }}
            />
          </Box>

          {/* Table Container */}
          <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                overflow: "hidden",
                bgcolor: "#fff",
                transition: "all 0.3s ease-in-out",
              }}
          >
            {loading ? (
                <Box py={6} textAlign="center">
                  <CircularProgress size={40} color="primary" />
                </Box>
            ) : error ? (
                <Box p={4}>
                  <Typography color="error" align="center" fontSize="lg">
                    {error}
                  </Typography>
                </Box>
            ) : filteredAppointments.length === 0 ? (
                <Box p={4}>
                  <Typography color="text.secondary" align="center" fontStyle="italic">
                    No matching appointments found.
                  </Typography>
                </Box>
            ) : (
                <Table aria-label="appointments table">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.main" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Patient</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Doctor</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Time</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAppointments.map((appt) => (
                        <TableRow
                            key={appt.id}
                            hover
                            sx={{
                              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.03)" },
                              transition: "background-color 0.2s ease",
                            }}
                        >
                          <TableCell>{appt.id}</TableCell>
                          <TableCell>
                            <Tooltip title={appt.patientName || "-"} arrow>
                              <span className="font-medium">{appt.patientName || "-"}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={appt.patientEmail || "-"} arrow>
                              <span>{appt.patientEmail || "-"}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{appt.doctorName}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <EventIcon fontSize="small" color="action" />
                              {appt.date}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <AccessTimeIcon fontSize="small" color="action" />
                              {appt.time}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Delete Appointment">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(appt)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </TableContainer>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="delete-dialog-title"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="delete-dialog-title">
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the appointment for{" "}
              <strong>{appointmentToDelete?.patientName}</strong> with{" "}
              <strong>{appointmentToDelete?.doctorName}</strong> on{" "}
              <strong>{appointmentToDelete?.date}</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button 
              onClick={handleDialogClose} 
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={!appointmentToDelete}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
  );
};

export default AdminViewAppointment;