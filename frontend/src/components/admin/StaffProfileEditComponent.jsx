import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, Save, Cancel } from "@mui/icons-material";
import { getStaffById, updateStaff } from "../../services/staffService";
import { toast } from "react-toastify";

const StaffProfileEditComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
    department: "",
    address: "",
    city: "",
    state: "",
    dateOfBirth: "",
    hireDate: "",
    salary: "",
    emergencyContact: "",
    emergencyPhone: "",
    password: "", // New password field
  });

  useEffect(() => {
    fetchStaffData();
  }, [id]);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const data = await getStaffById(id);
      setStaff(data);
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        role: data.role || "",
        department: data.department || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : "",
        hireDate: data.hireDate ? data.hireDate.split('T')[0] : "",
        salary: data.salary || "",
        emergencyContact: data.emergencyContact || "",
        emergencyPhone: data.emergencyPhone || "",
        password: "", // Password field is empty for security
      });
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("Failed to fetch staff data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Create the request object
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        department: formData.department,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        dateOfBirth: formData.dateOfBirth,
        hireDate: formData.hireDate,
        salary: parseFloat(formData.salary),
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
      };
      // Only include password if provided and valid
      if (formData.password && formData.password.length >= 8) {
        requestData.password = formData.password;
      }

      await updateStaff(id, requestData);
      toast.success("Staff profile updated successfully!");
      navigate("/admin/profile", { state: { tab: "manage-staff" } });
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Failed to update staff profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/profile", { state: { tab: "manage-staff" } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleCancel}
          >
            Back
          </Button>
          <Typography variant="h4" color="primary">
            Edit Staff Profile
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardHeader title="Staff Information" />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Password Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Password Update
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Leave password field empty if you don't want to change it.
                </Alert>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  helperText="Minimum 8 characters"
                />
              </Grid>

              {/* Employment Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Employment Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    label="Role"
                  >
                    <MenuItem value="Nurse">Nurse</MenuItem>
                    <MenuItem value="Doctor">Doctor</MenuItem>
                    <MenuItem value="Receptionist">Receptionist</MenuItem>
                    <MenuItem value="Lab Technician">Lab Technician</MenuItem>
                    <MenuItem value="Ward Boy">Ward Boy</MenuItem>
                    <MenuItem value="Security">Security</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    label="Department"
                  >
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Emergency">Emergency</MenuItem>
                    <MenuItem value="Cardiology">Cardiology</MenuItem>
                    <MenuItem value="Neurology">Neurology</MenuItem>
                    <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                    <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                    <MenuItem value="Laboratory">Laboratory</MenuItem>
                    <MenuItem value="Radiology">Radiology</MenuItem>
                    <MenuItem value="Pharmacy">Pharmacy</MenuItem>
                    <MenuItem value="Administration">Administration</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hire Date"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Personal Details */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Personal Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Address
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Emergency Contact */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Emergency Contact
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Name"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Phone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={saving}
                  >
                    {saving ? <CircularProgress size={20} /> : "Save Changes"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StaffProfileEditComponent; 