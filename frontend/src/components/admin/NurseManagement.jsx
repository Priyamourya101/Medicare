import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fab,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Add,
  Refresh,
  LocalHospital,
  Person,
  Edit,
  Delete,
  Visibility,
} from "@mui/icons-material";
import { toast } from "react-toastify";

// Nurse Registration Form Component
const NurseRegistrationForm = ({ onNurseAdded, onCancel, editingNurse }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    specialization: "",
    department: "",
    shift: "",
    experience: "",
    education: "",
    address: "",
    city: "",
    state: "",
    dateOfBirth: "",
    hireDate: "",
    salary: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingNurse) {
      setFormData(editingNurse);
    }
  }, [editingNurse]);

  const specializations = [
    "Critical Care",
    "Pediatric Nursing",
    "Emergency Room",
    "Maternity Nursing",
    "Surgical Nursing",
    "Geriatric Nursing",
    "Mental Health",
    "Oncology",
    "Cardiology",
    "Orthopedic",
  ];

  const departments = [
    "ICU",
    "Pediatrics",
    "Emergency",
    "Maternity",
    "Surgery",
    "Geriatrics",
    "Psychiatry",
    "Oncology",
    "Cardiology",
    "Orthopedic",
    "General Ward",
  ];

  const shifts = [
    "Morning (6 AM - 2 PM)",
    "Afternoon (2 PM - 10 PM)",
    "Night (10 PM - 6 AM)",
    "Rotating",
  ];

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required";
    if (!formData.specialization)
      newErrors.specialization = "Specialization is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.shift) newErrors.shift = "Shift is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    else if (formData.experience < 0)
      newErrors.experience = "Experience cannot be negative";
    if (!formData.education.trim())
      newErrors.education = "Education is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.hireDate) newErrors.hireDate = "Hire date is required";
    if (!formData.salary) newErrors.salary = "Salary is required";
    else if (formData.salary < 0) newErrors.salary = "Salary cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const nurseData = {
        ...formData,
        experience: parseInt(formData.experience),
        salary: parseFloat(formData.salary),
      };

      if (editingNurse) {
        onNurseAdded(editingNurse.id, nurseData);
      } else {
        onNurseAdded(nurseData);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" gutterBottom>
            Personal Information
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Professional Information */}
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
            Professional Information
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="licenseNumber"
            label="License Number"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            error={!!errors.licenseNumber}
            helperText={errors.licenseNumber}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.specialization}>
            <InputLabel>Specialization</InputLabel>
            <Select
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              label="Specialization"
            >
              {specializations.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </Select>
            {errors.specialization && (
              <Typography variant="caption" color="error">
                {errors.specialization}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.department}>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              label="Department"
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
            {errors.department && (
              <Typography variant="caption" color="error">
                {errors.department}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.shift}>
            <InputLabel>Shift</InputLabel>
            <Select
              name="shift"
              value={formData.shift}
              onChange={handleInputChange}
              label="Shift"
            >
              {shifts.map((shift) => (
                <MenuItem key={shift} value={shift}>
                  {shift}
                </MenuItem>
              ))}
            </Select>
            {errors.shift && (
              <Typography variant="caption" color="error">
                {errors.shift}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="experience"
            label="Experience (Years)"
            type="number"
            value={formData.experience}
            onChange={handleInputChange}
            error={!!errors.experience}
            helperText={errors.experience}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="education"
            label="Education"
            value={formData.education}
            onChange={handleInputChange}
            error={!!errors.education}
            helperText={errors.education}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="hireDate"
            label="Hire Date"
            type="date"
            value={formData.hireDate}
            onChange={handleInputChange}
            error={!!errors.hireDate}
            helperText={errors.hireDate}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="salary"
            label="Salary (₹)"
            type="number"
            value={formData.salary}
            onChange={handleInputChange}
            error={!!errors.salary}
            helperText={errors.salary}
            fullWidth
            required
          />
        </Grid>

        {/* Address Information */}
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
            Address Information
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="address"
            label="Address"
            multiline
            rows={3}
            value={formData.address}
            onChange={handleInputChange}
            error={!!errors.address}
            helperText={errors.address}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="city"
            label="City"
            value={formData.city}
            onChange={handleInputChange}
            error={!!errors.city}
            helperText={errors.city}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.state}>
            <InputLabel>State</InputLabel>
            <Select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              label="State"
            >
              {indianStates.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
            {errors.state && (
              <Typography variant="caption" color="error">
                {errors.state}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
            Emergency Contact (Optional)
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="emergencyContact"
            label="Emergency Contact Name"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="emergencyPhone"
            label="Emergency Contact Phone"
            value={formData.emergencyPhone}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 3 }}>
            <Button onClick={onCancel} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<Add />}>
              {editingNurse ? "Update Nurse" : "Add Nurse"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Simple Nurse Table Component
const ViewNurseTable = ({ nurseList, onView, onEdit, onDelete }) => {
  const getShiftColor = (shift) => {
    if (shift.includes("Morning")) return "success";
    if (shift.includes("Afternoon")) return "warning";
    if (shift.includes("Night")) return "info";
    return "default";
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>License</strong></TableCell>
            <TableCell><strong>Specialization</strong></TableCell>
            <TableCell><strong>Department</strong></TableCell>
            <TableCell><strong>Shift</strong></TableCell>
            <TableCell><strong>Experience</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nurseList.map((nurse) => (
            <TableRow key={nurse.id}>
              <TableCell>{nurse.fullName}</TableCell>
              <TableCell>{nurse.licenseNumber}</TableCell>
              <TableCell>{nurse.specialization}</TableCell>
              <TableCell>{nurse.department}</TableCell>
              <TableCell>
                <Chip
                  label={nurse.shift}
                  color={getShiftColor(nurse.shift)}
                  size="small"
                />
              </TableCell>
              <TableCell>{nurse.experience} years</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => onView(nurse)}
                  color="primary"
                  size="small"
                >
                  <Visibility />
                </IconButton>
                <IconButton
                  onClick={() => onEdit(nurse)}
                  color="info"
                  size="small"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(nurse)}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Main Nurse Management Component
const NurseManagement = () => {
  const [nurseList, setNurseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, nurse: null });
  const [viewDialog, setViewDialog] = useState({ open: false, nurse: null });

  useEffect(() => {
    fetchNurseData();
  }, []);

  const fetchNurseData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API call
      const sampleData = [
        {
          id: 1,
          fullName: "Priya Patel",
          email: "priya.patel@example.com",
          phone: "9876543210",
          licenseNumber: "NUR001",
          specialization: "Critical Care",
          department: "ICU",
          shift: "Night (10 PM - 6 AM)",
          experience: 5,
          education: "BSc Nursing",
          address: "123 Medical Colony, Mumbai",
          city: "Mumbai",
          state: "Maharashtra",
          dateOfBirth: "1990-08-15",
          hireDate: "2019-03-01",
          salary: 45000,
          emergencyContact: "Raj Patel",
          emergencyPhone: "9876543211",
        },
        {
          id: 2,
          fullName: "Anita Sharma",
          email: "anita.sharma@example.com",
          phone: "8765432109",
          licenseNumber: "NUR002",
          specialization: "Pediatric Nursing",
          department: "Pediatrics",
          shift: "Morning (6 AM - 2 PM)",
          experience: 8,
          education: "BSc Nursing, Pediatric Certification",
          address: "456 Health Street, Delhi",
          city: "Delhi",
          state: "Delhi",
          dateOfBirth: "1988-12-20",
          hireDate: "2016-07-15",
          salary: 52000,
          emergencyContact: "Vikram Sharma",
          emergencyPhone: "8765432110",
        },
      ];
      setNurseList(sampleData);
      toast.success("Nurse data loaded successfully!");
    } catch (error) {
      console.error("Error fetching nurse data:", error);
      toast.error("Error loading nurse data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNurse = (nurseData) => {
    const newNurse = {
      id: Date.now(),
      ...nurseData,
    };
    setNurseList((prev) => [...prev, newNurse]);
    setShowForm(false);
    toast.success("Nurse added successfully!");
  };

  const handleUpdateNurse = (nurseId, updatedData) => {
    setNurseList((prev) =>
      prev.map((nurse) =>
        nurse.id === nurseId ? { ...nurse, ...updatedData } : nurse
      )
    );
    setEditingNurse(null);
    setShowForm(false);
    toast.success("Nurse updated successfully!");
  };

  const handleDeleteNurse = (nurseId) => {
    setNurseList((prev) => prev.filter((nurse) => nurse.id !== nurseId));
    setDeleteDialog({ open: false, nurse: null });
    toast.success("Nurse deleted successfully!");
  };

  const handleViewNurse = (nurse) => {
    setViewDialog({ open: true, nurse });
  };

  const handleEditNurse = (nurse) => {
    setEditingNurse(nurse);
    setShowForm(true);
  };

  const handleDeleteClick = (nurse) => {
    setDeleteDialog({ open: true, nurse });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingNurse(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <LocalHospital color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" color="primary">
            Nurse Management
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchNurseData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowForm(true)}
          >
            Add New Nurse
          </Button>
        </Box>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Nurse Table */}
      {!loading && (
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <Person />
                <Typography variant="h6">
                  Nurse Directory ({nurseList.length} nurses)
                </Typography>
              </Box>
            }
            sx={{ backgroundColor: "#f5f5f5" }}
          />
          <CardContent>
            <ViewNurseTable
              nurseList={nurseList}
              onView={handleViewNurse}
              onEdit={handleEditNurse}
              onDelete={handleDeleteClick}
            />
          </CardContent>
        </Card>
      )}

      {/* Registration Form Dialog */}
      <Dialog
        open={showForm}
        onClose={handleCancelForm}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          {editingNurse ? "Edit Nurse" : "Add New Nurse"}
        </DialogTitle>
        <DialogContent>
          <NurseRegistrationForm
            onNurseAdded={editingNurse ? handleUpdateNurse : handleAddNurse}
            onCancel={handleCancelForm}
            editingNurse={editingNurse}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, nurse: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{deleteDialog.nurse?.fullName}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, nurse: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteNurse(deleteDialog.nurse?.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Nurse Details Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, nurse: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Nurse Details - {viewDialog.nurse?.fullName}
        </DialogTitle>
        <DialogContent>
          {viewDialog.nurse && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
                <Typography><strong>Name:</strong> {viewDialog.nurse.fullName}</Typography>
                <Typography><strong>Email:</strong> {viewDialog.nurse.email}</Typography>
                <Typography><strong>Phone:</strong> {viewDialog.nurse.phone}</Typography>
                <Typography><strong>License:</strong> {viewDialog.nurse.licenseNumber}</Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Professional Information
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
                <Typography><strong>Specialization:</strong> {viewDialog.nurse.specialization}</Typography>
                <Typography><strong>Department:</strong> {viewDialog.nurse.department}</Typography>
                <Typography><strong>Shift:</strong> {viewDialog.nurse.shift}</Typography>
                <Typography><strong>Experience:</strong> {viewDialog.nurse.experience} years</Typography>
                <Typography><strong>Education:</strong> {viewDialog.nurse.education}</Typography>
                <Typography><strong>Salary:</strong> ₹{viewDialog.nurse.salary?.toLocaleString()}</Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
              <Box mb={3}>
                <Typography>{viewDialog.nurse.address}</Typography>
                <Typography>{viewDialog.nurse.city}, {viewDialog.nurse.state}</Typography>
              </Box>

              {viewDialog.nurse.emergencyContact && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Emergency Contact
                  </Typography>
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                    <Typography><strong>Name:</strong> {viewDialog.nurse.emergencyContact}</Typography>
                    <Typography><strong>Phone:</strong> {viewDialog.nurse.emergencyPhone}</Typography>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, nurse: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => setShowForm(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default NurseManagement;