import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Business,
  Work,
  LocationOn,
  Save,
  Clear,
  LocalHospital,
  School,
  Badge,
} from "@mui/icons-material";
import { addNurse } from "../../services/nurseService";
import { toast } from "react-toastify";

const NurseRegistrationForm = ({ onNurseAdded, onCancel, editingNurse }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
  const [loading, setLoading] = useState(false);

  const specializations = [
    "General Nursing",
    "Critical Care",
    "Emergency Room",
    "Pediatric Nursing",
    "Maternity Nursing",
    "Surgical Nursing",
    "Cardiac Care",
    "Oncology Nursing",
    "Psychiatric Nursing",
    "Geriatric Nursing",
    "ICU Nursing",
    "NICU Nursing",
    "Operating Room",
    "Recovery Room",
    "Home Health",
  ];

  const departments = [
    "Emergency",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine",
    "Surgery",
    "ICU",
    "NICU",
    "Maternity",
    "Oncology",
    "Psychiatry",
    "Geriatrics",
    "Recovery Room",
    "Operating Room",
    "Outpatient",
  ];

  const shifts = [
    "Morning (6 AM - 2 PM)",
    "Afternoon (2 PM - 10 PM)",
    "Night (10 PM - 6 AM)",
    "Day (8 AM - 4 PM)",
    "Evening (4 PM - 12 AM)",
    "Rotating",
    "On-Call",
  ];

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
  ];

  useEffect(() => {
    if (editingNurse) {
      const [firstName, ...lastNameParts] = editingNurse.fullName?.split(' ') || [];
      const lastName = lastNameParts.join(' ');
      
      setFormData({
        firstName: firstName || "",
        lastName: lastName || "",
        email: editingNurse.email || "",
        phone: editingNurse.phone || "",
        licenseNumber: editingNurse.licenseNumber || "",
        specialization: editingNurse.specialization || "",
        department: editingNurse.department || "",
        shift: editingNurse.shift || "",
        experience: editingNurse.experience?.toString() || "",
        education: editingNurse.education || "",
        address: editingNurse.address || "",
        city: editingNurse.city || "",
        state: editingNurse.state || "",
        dateOfBirth: editingNurse.dateOfBirth || "",
        hireDate: editingNurse.hireDate || "",
        salary: editingNurse.salary?.toString() || "",
        emergencyContact: editingNurse.emergencyContact || "",
        emergencyPhone: editingNurse.emergencyPhone || "",
      });
    }
  }, [editingNurse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
    if (!formData.specialization) newErrors.specialization = "Specialization is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.shift) newErrors.shift = "Shift is required";
    if (!formData.experience.trim()) newErrors.experience = "Experience is required";
    else if (isNaN(formData.experience) || parseFloat(formData.experience) < 0) {
      newErrors.experience = "Experience must be a positive number";
    }
    
    if (!formData.education.trim()) newErrors.education = "Education is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.hireDate) newErrors.hireDate = "Hire date is required";
    if (!formData.salary.trim()) newErrors.salary = "Salary is required";
    else if (isNaN(formData.salary) || parseFloat(formData.salary) <= 0) {
      newErrors.salary = "Salary must be a positive number";
    }

    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    const hireDate = new Date(formData.hireDate);
    
    if (birthDate > today) newErrors.dateOfBirth = "Date of birth cannot be in the future";
    if (hireDate > today) newErrors.hireDate = "Hire date cannot be in the future";
    if (birthDate > hireDate) newErrors.dateOfBirth = "Date of birth cannot be after hire date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const nurseData = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone.replace(/\D/g, ""),
        salary: parseFloat(formData.salary),
        experience: parseFloat(formData.experience),
      };

      if (editingNurse) {
        await onNurseAdded(editingNurse.id, nurseData);
        toast.success("Nurse updated successfully!");
      } else {
        const response = await addNurse(nurseData);
        toast.success("Nurse added successfully!");
        
        if (onNurseAdded) {
          onNurseAdded(response);
        }
      }
      
      setFormData({
        firstName: "", lastName: "", email: "", phone: "", licenseNumber: "",
        specialization: "", department: "", shift: "", experience: "", education: "",
        address: "", city: "", state: "", dateOfBirth: "", hireDate: "",
        salary: "", emergencyContact: "", emergencyPhone: "",
      });
    } catch (error) {
      console.error("Error saving nurse:", error);
      toast.error(error.response?.data?.message || "Failed to save nurse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 900, mx: "auto", mt: 4, mb: 4 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <LocalHospital color="primary" />
            <Typography variant="h5">
              {editingNurse ? "Edit Nurse" : "Nurse Registration Form"}
            </Typography>
          </Box>
        }
        sx={{ backgroundColor: "#f5f5f5" }}
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Personal Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{ startAdornment: <Person /> }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{ startAdornment: <Email /> }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{ startAdornment: <Phone /> }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hire Date"
                name="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={handleChange}
                error={!!errors.hireDate}
                helperText={errors.hireDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Professional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Professional Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                error={!!errors.licenseNumber}
                helperText={errors.licenseNumber}
                InputProps={{ startAdornment: <Badge /> }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.specialization}>
                <InputLabel>Specialization</InputLabel>
                <Select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  label="Specialization"
                  startAdornment={<LocalHospital />}
                >
                  {specializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>{spec}</MenuItem>
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
              <FormControl fullWidth error={!!errors.department}>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  label="Department"
                  startAdornment={<Business />}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
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
              <FormControl fullWidth error={!!errors.shift}>
                <InputLabel>Shift</InputLabel>
                <Select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  label="Shift"
                  startAdornment={<Work />}
                >
                  {shifts.map((shift) => (
                    <MenuItem key={shift} value={shift}>{shift}</MenuItem>
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
                fullWidth
                label="Years of Experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                error={!!errors.experience}
                helperText={errors.experience}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary (₹)"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                error={!!errors.salary}
                helperText={errors.salary}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                error={!!errors.education}
                helperText={errors.education}
                InputProps={{ startAdornment: <School /> }}
              />
            </Grid>

            {/* Address Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Address Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                InputProps={{ startAdornment: <LocationOn /> }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.state}>
                <InputLabel>State</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  label="State"
                >
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
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
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Emergency Contact (Optional)
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  startIcon={<Clear />}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  disabled={loading}
                >
                  {loading ? (editingNurse ? "Updating Nurse..." : "Adding Nurse...") : (editingNurse ? "Update Nurse" : "Add Nurse")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NurseRegistrationForm; 