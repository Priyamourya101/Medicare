import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { addStaff } from "../../services/staffService";
import { toast } from "react-toastify";

const StaffRegistrationForm = () => {
  const navigate = useNavigate();
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
    country: "India", // Default country
    dateOfBirth: "",
    hireDate: "",
    salary: "",
    emergencyContact: "",
    emergencyPhone: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Register button clicked", formData); // Debug log
    setSaving(true);

    try {
      // Validate required fields
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phoneNumber', 
        'role', 'department', 'address', 'city', 'state', 'country',
        'dateOfBirth', 'hireDate', 'salary', 'password'
      ];

      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setSaving(false);
        return; 
      }

      // Validate password length
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        setSaving(false);
        return;
      }

      // Validate phone number format (backend expects ^\+?[0-9]{10,15}$)
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        toast.error("Phone number must be 10-15 digits, optionally starting with +");
        setSaving(false);
        return;
      }

      // Validate dates
      if (!formData.dateOfBirth || !formData.hireDate) {
        toast.error("Date of Birth and Hire Date are required");
        setSaving(false);
        return;
      }

      // Validate that hire date is not before date of birth
      const dob = new Date(formData.dateOfBirth);
      const hire = new Date(formData.hireDate);
      if (hire < dob) {
        toast.error("Hire Date cannot be before Date of Birth");
        setSaving(false);
        return;
      }

      // Validate that dates are not in the future
      const today = new Date();
      if (dob > today) {
        toast.error("Date of Birth cannot be in the future");
        setSaving(false);
        return;
      }
      if (hire > today) {
        toast.error("Hire Date cannot be in the future");
        setSaving(false);
        return;
      }

      // Validate salary
      const salary = parseFloat(formData.salary);
      if (isNaN(salary) || salary <= 0) {
        toast.error("Salary must be a positive number");
        setSaving(false);
        return;
      }

      // Create the request object with proper data types
      const requestData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        role: formData.role,
        department: formData.department,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        dateOfBirth: formData.dateOfBirth, // Backend will parse this as LocalDate
        hireDate: formData.hireDate,       // Backend will parse this as LocalDate
        salary: salary, // Double value
        emergencyContact: formData.emergencyContact?.trim() || null,
        emergencyPhone: formData.emergencyPhone?.trim() || null,
        password: formData.password,
      };

      console.log("Sending staff data:", requestData);

      const response = await addStaff(requestData);
      toast.success("Staff member registered successfully!");
      navigate("/admin/profile", { state: { tab: "manage-staff" } });
    } catch (error) {
      console.error("Error registering staff:", error);
      
      if (error.response?.status === 400) {
        // Handle validation errors
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          toast.error(errorData);
        } else if (errorData && typeof errorData === 'object') {
          // Handle validation error object
          const errorMessages = [];
          if (errorData.message) {
            errorMessages.push(errorData.message);
          }
          if (errorData.errors) {
            errorData.errors.forEach(err => {
              errorMessages.push(`${err.field}: ${err.defaultMessage}`);
            });
          }
          toast.error(errorMessages.join(', '));
        } else {
          toast.error("Validation failed. Please check your input.");
        }
      } else if (error.response?.status === 409) {
        toast.error("Email already exists. Please use a different email.");
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. You don't have permission to register staff.");
      } else {
        toast.error("Failed to register staff member. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/profile", { state: { tab: "manage-staff" } });
  };

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
            Register New Staff Member
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardHeader title="Staff Registration Form" />
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
                  label="First Name *"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name *"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
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
                  label="Phone Number *"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Password Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  This password will be used for staff login authentication.
                </Alert>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password *"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
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
                  <InputLabel>Role *</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    label="Role *"
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
                  <InputLabel>Department *</InputLabel>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    label="Department *"
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
                  label="Hire Date *"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: formData.dateOfBirth || undefined, // Must be after date of birth
                    max: new Date().toISOString().split('T')[0] // Prevent future dates
                  }}
                  helperText="Must be after date of birth and not in the future"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salary *"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                  inputProps={{
                    min: 0,
                    step: 0.01
                  }}
                  helperText="Enter salary amount (positive number)"
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
                  label="Date of Birth *"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0] // Prevent future dates
                  }}
                  helperText="Must be a valid past date"
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
                  label="Address *"
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
                  label="City *"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State *"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country *"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Emergency Contact */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Emergency Contact (Optional)
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
                    {saving ? <CircularProgress size={20} /> : "Register Staff"}
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

export default StaffRegistrationForm; 