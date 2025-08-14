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
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  Email,
  Phone,
  LocationOn,
  Work,
  Business,
  CalendarToday,
  AttachMoney,
  Emergency,
} from "@mui/icons-material";
import { getStaffById, deleteStaff } from "../services/staffService";
import { toast } from "react-toastify";

const StaffProfile = (props) => {
  const params = useParams();
  const id = props.id || params.id;
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No staff ID provided.");
      setLoading(false);
      return;
    }
    fetchStaffData();
  }, [id]);

  const fetchStaffData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStaffById(id);
      setStaff(data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      setError("Failed to fetch staff data. Please try again.");
      toast.error("Failed to fetch staff data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/staff/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff(id);
        toast.success("Staff member deleted successfully!");
        navigate("/admin/staff");
      } catch (error) {
        console.error("Error deleting staff:", error);
        toast.error("Failed to delete staff member");
      }
    }
  };

  const handleBack = () => {
    navigate("/admin/profile", { state: { tab: "manage-staff" } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Box textAlign="center">
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={handleBack}>
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  if (!staff) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            Staff member not found
          </Typography>
          <Button variant="contained" onClick={handleBack}>
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    return `₹${salary.toLocaleString()}`;
  };

  const getFullName = () => {
    if (staff.firstName && staff.lastName) {
      return `${staff.firstName} ${staff.lastName}`;
    }
    return staff.firstName || staff.lastName || "Unknown";
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
            Staff Profile
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
            Delete Staff
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
                {getInitials(getFullName())}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {getFullName()}
              </Typography>
              <Chip
                label={staff.role || "Not specified"}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {staff.department || "Not specified"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Employee ID: {staff.id}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Details Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Personal Information" />
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
                      <Typography><strong>Email:</strong> {staff.email || "Not specified"}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Phone color="primary" />
                      <Typography><strong>Phone:</strong> {staff.phoneNumber || "Not specified"}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Divider sx={{ width: "100%", my: 2 }} />

                {/* Employment Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Employment Information
                  </Typography>
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Work color="primary" />
                      <Typography><strong>Role:</strong> {staff.role || "Not specified"}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Business color="primary" />
                      <Typography><strong>Department:</strong> {staff.department || "Not specified"}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday color="primary" />
                      <Typography><strong>Hire Date:</strong> {formatDate(staff.hireDate)}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AttachMoney color="primary" />
                      <Typography><strong>Salary:</strong> {formatSalary(staff.salary)}</Typography>
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
                      <Typography><strong>Date of Birth:</strong> {formatDate(staff.dateOfBirth)}</Typography>
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
                      <Typography>{staff.address || "Not specified"}</Typography>
                      <Typography>{staff.city || ""}, {staff.state || ""}</Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Emergency Contact */}
                {staff.emergencyContact && (
                  <>
                    <Divider sx={{ width: "100%", my: 2 }} />
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Emergency Contact
                      </Typography>
                      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Emergency color="primary" />
                          <Typography><strong>Name:</strong> {staff.emergencyContact}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Phone color="primary" />
                          <Typography><strong>Phone:</strong> {staff.emergencyPhone || "Not specified"}</Typography>
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

export default StaffProfile;
