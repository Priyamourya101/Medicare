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
  Chip,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  LocalHospital,
  Email,
  Phone,
  LocationOn,
  Work,
  Business,
  CalendarToday,
  AttachMoney,
  Emergency,
  Badge,
  School,
} from "@mui/icons-material";
import { getNurseById, deleteNurse } from "../services/nurseService";
import { toast } from "react-toastify";

const NurseProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nurse, setNurse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNurseData();
  }, [id]);

  const fetchNurseData = async () => {
    setLoading(true);
    try {
      const data = await getNurseById(id);
      setNurse(data);
    } catch (error) {
      console.error("Error fetching nurse data:", error);
      // For demo purposes, use sample data
      const sampleNurse = {
        id: parseInt(id),
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
      };
      setNurse(sampleNurse);
      toast.info("Using sample data. Connect to backend for real data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/nurses/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this nurse?")) {
      try {
        await deleteNurse(id);
        toast.success("Nurse deleted successfully!");
        navigate("/admin/nurses");
      } catch (error) {
        console.error("Error deleting nurse:", error);
        toast.error("Failed to delete nurse");
      }
    }
  };

  const handleBack = () => {
    navigate("/admin/nurses");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Loading nurse profile...</Typography>
      </Box>
    );
  }

  if (!nurse) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Nurse not found</Typography>
      </Box>
    );
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary) => {
    return `₹${salary?.toLocaleString()}`;
  };

  const getSpecializationColor = (specialization) => {
    switch (specialization) {
      case "Critical Care":
        return "error";
      case "Pediatric Nursing":
        return "primary";
      case "Emergency Room":
        return "warning";
      case "Maternity Nursing":
        return "success";
      case "Surgical Nursing":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={handleBack} color="primary">
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" color="primary">
            Nurse Profile
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Delete Nurse
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: "2rem",
                }}
              >
                {getInitials(nurse.fullName)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {nurse.fullName}
              </Typography>
              <Chip
                label={nurse.specialization}
                color={getSpecializationColor(nurse.specialization)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {nurse.department}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                License: {nurse.licenseNumber}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Employee ID: {nurse.id}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Details Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Professional Information" />
            <CardContent>
              <Grid container spacing={3}>
                {/* Contact Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Email color="primary" />
                      <Typography><strong>Email:</strong> {nurse.email}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Phone color="primary" />
                      <Typography><strong>Phone:</strong> {nurse.phone}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge color="primary" />
                      <Typography><strong>License:</strong> {nurse.licenseNumber}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Divider sx={{ width: "100%", my: 2 }} />

                {/* Professional Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Professional Information
                  </Typography>
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocalHospital color="primary" />
                      <Typography><strong>Specialization:</strong> {nurse.specialization}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Business color="primary" />
                      <Typography><strong>Department:</strong> {nurse.department}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Work color="primary" />
                      <Typography><strong>Shift:</strong> {nurse.shift}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday color="primary" />
                      <Typography><strong>Experience:</strong> {nurse.experience} years</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <School color="primary" />
                      <Typography><strong>Education:</strong> {nurse.education}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AttachMoney color="primary" />
                      <Typography><strong>Salary:</strong> {formatSalary(nurse.salary)}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Divider sx={{ width: "100%", my: 2 }} />

                {/* Personal Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Personal Details
                  </Typography>
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday color="primary" />
                      <Typography><strong>Date of Birth:</strong> {formatDate(nurse.dateOfBirth)}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday color="primary" />
                      <Typography><strong>Hire Date:</strong> {formatDate(nurse.hireDate)}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Divider sx={{ width: "100%", my: 2 }} />

                {/* Address */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Address
                  </Typography>
                  <Box display="flex" alignItems="flex-start" gap={1} mb={3}>
                    <LocationOn color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography>{nurse.address}</Typography>
                      <Typography>{nurse.city}, {nurse.state}</Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Emergency Contact */}
                {nurse.emergencyContact && (
                  <>
                    <Divider sx={{ width: "100%", my: 2 }} />
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Emergency Contact
                      </Typography>
                      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Emergency color="primary" />
                          <Typography><strong>Name:</strong> {nurse.emergencyContact}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Phone color="primary" />
                          <Typography><strong>Phone:</strong> {nurse.emergencyPhone}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NurseProfile;
