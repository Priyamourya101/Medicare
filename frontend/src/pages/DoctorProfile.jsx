import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Fab
} from "@mui/material";
import {
  Home,
  CalendarToday,
  LocalPharmacy,
  Feedback as FeedbackIcon,
  Menu,
  DarkMode,
  LightMode,
  Person,
  MedicalServices,
  People,
  EventAvailable,
  ReceiptLong,
  Add as AddIcon,
  PersonAdd
} from "@mui/icons-material";
import { fetchDoctorDetails } from "../services/doctorService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogoutButton from "../components/doctor/LogoutButton";

function DoctorProfile() {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [addDoctorLoading, setAddDoctorLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Add Doctor Form State
  const [newDoctor, setNewDoctor] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    state: '',
    country: '',
    gender: '',
    specialization: '',
    bloodGroup: '',
    dateOfBirth: '',
    joiningDate: '',
    password: ''
  });

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Family Medicine',
    'Internal Medicine',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Anesthesiology',
    'Pathology',
    'Gynecology',
    'Ophthalmology',
    'ENT (Ear, Nose, Throat)',
    'Urology',
    'Gastroenterology',
    'Endocrinology'
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  const getDoctorData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      console.log("Token exists:", !!token);
      console.log("Token preview:", token ? token.substring(0, 50) + "..." : "No token");
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        toast.error("Authentication required");
        return;
      }

      console.log("Making API call to /api/doctors/mydetails");
      const data = await fetchDoctorDetails();
      console.log("API response received:", data);
      
      setDoctorData(data);
      setLoading(false);
      toast.success("Doctor data loaded successfully");
    } catch (err) {
      console.error("=== ERROR DETAILS ===");
      console.error("Error message:", err.message);
      console.error("Error status:", err.response?.status);
      console.error("Error status text:", err.response?.statusText);
      console.error("Error data:", err.response?.data);
      console.error("Error headers:", err.response?.headers);
      console.error("Request config:", err.config);
      console.error("=====================");
      
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        setError("Authentication failed. Please login again.");
        toast.error("Authentication failed");
        setTimeout(() => {
          window.location.href = "/LifeBridgeHospital/login";
        }, 2000);
      } else if (err.message.includes("500")) {
        setError("Server error. Please try again later.");
        toast.error("Server error occurred");
      } else {
        setError("Failed to load doctor data. Please try again.");
        toast.error("Failed to load doctor data");
      }
      
      setLoading(false);
    }
  };

  const handleAddDoctorSubmit = async () => {
    setAddDoctorLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      
      if (!token) {
        toast.error("Authentication required");
        setAddDoctorLoading(false);
        return;
      }

      if (!newDoctor.firstName || !newDoctor.lastName || !newDoctor.email || !newDoctor.specialization || !newDoctor.password) {
        toast.error("Please fill in all required fields (First Name, Last Name, Email, Specialization, Password)");
        setAddDoctorLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newDoctor.email)) {
        toast.error("Please enter a valid email address");
        setAddDoctorLoading(false);
        return;
      }

      if (newDoctor.phoneNumber && !/^\d{10,}$/.test(newDoctor.phoneNumber.replace(/\s+/g, ''))) {
        toast.error("Please enter a valid phone number (at least 10 digits)");
        setAddDoctorLoading(false);
        return;
      }

      if (newDoctor.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        setAddDoctorLoading(false);
        return;
      }

      const doctorData = {
        ...newDoctor,
        dateOfBirth: newDoctor.dateOfBirth || null,
        joiningDate: newDoctor.joiningDate || new Date().toISOString().split('T')[0],
      };

      console.log("Submitting doctor data:", doctorData);

      const possibleEndpoints = [
        "http://localhost:8080/hospital/api/doctors/add",
        "http://localhost:8080/api/doctors/add",
        "http://localhost:8080/hospital/api/admin/doctors/add",
        "http://localhost:8080/api/admin/doctors/add"
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of possibleEndpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(doctorData)
          });

          if (response.ok) {
            break;
          } else if (response.status !== 404) {
            lastError = await response.text();
            console.log(`Endpoint ${endpoint} returned ${response.status}: ${lastError}`);
            break;
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed:`, error.message);
          lastError = error;
          continue;
        }
      }

      if (!response) {
        throw new Error("All API endpoints failed. Please check your backend configuration.");
      }

      if (response.ok) {
        const result = await response.json().catch(() => ({}));
        console.log("Doctor added successfully:", result);
        toast.success("Doctor added successfully!");
        setAddDoctorOpen(false);
        
        setNewDoctor({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          city: '',
          state: '',
          country: '',
          gender: '',
          specialization: '',
          bloodGroup: '',
          dateOfBirth: '',
          joiningDate: '',
          password: ''
        });
      } else {
        const errorData = await response.text().catch(() => "Unknown error");
        console.error("Add doctor error response:", response.status, errorData);
        
        if (response.status === 401) {
          toast.error("Authentication failed. Please login again.");
        } else if (response.status === 400) {
          toast.error("Invalid data provided. Please check all fields.");
        } else if (response.status === 409) {
          toast.error("Doctor with this email already exists.");
        } else if (response.status === 403) {
          toast.error("You don't have permission to add doctors.");
        } else {
          toast.error(`Failed to add doctor: ${errorData || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error("Add doctor network error:", error);
      toast.error(`Network error: ${error.message}`);
    } finally {
      setAddDoctorLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setNewDoctor(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  const sidebarItems = [
    {
      key: "profile",
      label: "Doctor Profile",
      icon: <Home />,
      path: "/doctor/profile",
    },
    {
      key: "view-appointments",
      label: "View Appointments",
      icon: <CalendarToday />,
      path: "/doctor/appointments",
    },
    {
      key: "issue-prescription",
      label: "Issue Prescription",
      icon: <LocalPharmacy />,
      path: "/doctor/appointments/:id/prescription",
    },
    {
      key: "feedback",
      label: "Feedback",
      icon: <FeedbackIcon />,
      path: "/doctor/feedback",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: darkMode ? "#0D1B2A" : "#E3F2FD",
        color: darkMode ? "#E0E0E0" : "#0D1B2A",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="sticky"
        sx={{
          background: darkMode
            ? "linear-gradient(90deg, #0D1B2A, #1B263B)"
            : "linear-gradient(90deg, #1976D2, #1565C0)",
          py: 1,
          px: 2,
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            MediCare Doctor Portal 
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <img
              src="https://cdn-icons-png.freepik.com/256/2894/2894807.png?ga=GA1.1.1973256367.1748951813"
              alt="Doctor"
              style={{
                borderRadius: "50%",
                width: 40,
                height: 40,
                objectFit: "cover",
              }}
            />
            <Typography variant="body1">
              {doctorData?.firstName || "Loading..."}
            </Typography>
            <LogoutButton />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            bgcolor: darkMode ? "#1B263B" : "#BBDEFB",
            color: darkMode ? "#FFF" : "#0D1B2A",
          },
        }}
      >
        <Toolbar />
        <List>
          {sidebarItems.map((item) => (
            <ListItem
              key={item.key}
              onClick={() => {
                setMobileOpen(false);
                navigate(item.path);
              }}
              sx={{
                width: '100%',
                textAlign: 'left',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : '#90CAF9',
                }
              }}
            >
              <ListItemIcon sx={{ color: darkMode ? "#FFF" : "#0D1B2A" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add doctor"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
            bgcolor: darkMode ? "#1976D2" : "#1976D2",
            "&:hover": {
              bgcolor: darkMode ? "#1565C0" : "#1565C0"
            }
          }}
          onClick={() => setAddDoctorOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Add Doctor Dialog */}
      <Dialog
        open={addDoctorOpen}
        onClose={() => setAddDoctorOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: darkMode ? "#1B263B" : "#BBDEFB",
            color: darkMode ? "#FFF" : "#0D1B2A"
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAdd />
            Add New Doctor
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              label="First Name *"
              value={newDoctor.firstName}
              onChange={handleInputChange('firstName')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            />
            <TextField
              label="Last Name *"
              value={newDoctor.lastName}
              onChange={handleInputChange('lastName')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            />
            <TextField
              label="Email *"
              type="email"
              value={newDoctor.email}
              onChange={handleInputChange('email')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            />
            <TextField
              label="Phone Number"
              value={newDoctor.phoneNumber}
              onChange={handleInputChange('phoneNumber')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            />
            <TextField
              label="City"
              value={newDoctor.city}
              onChange={handleInputChange('city')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            />
            <TextField
              label="State"
              value={newDoctor.state}
              onChange={handleInputChange('state')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            />
            <TextField
              label="Country"
              value={newDoctor.country}
              onChange={handleInputChange('country')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            />
            <TextField
              label="Password *"
              type="password"
              value={newDoctor.password}
              onChange={handleInputChange('password')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            />
            <TextField
              select
              label="Gender"
              value={newDoctor.gender}
              onChange={handleInputChange('gender')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            >
              {genders.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Specialization *"
              value={newDoctor.specialization}
              onChange={handleInputChange('specialization')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            >
              {specializations.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Blood Group"
              value={newDoctor.bloodGroup}
              onChange={handleInputChange('bloodGroup')}
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            >
              {bloodGroups.map((bg) => (
                <MenuItem key={bg} value={bg}>
                  {bg}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date of Birth"
              type="date"
              value={newDoctor.dateOfBirth}
              onChange={handleInputChange('dateOfBirth')}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            />
            <TextField
              label="Joining Date"
              type="date"
              value={newDoctor.joiningDate}
              onChange={handleInputChange('joiningDate')}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: darkMode ? '#FFF' : '#0D1B2A',
                  '& fieldset': { borderColor: darkMode ? '#90CAF9' : '#42A5F5' }
                },
                '& .MuiInputLabel-root': { color: darkMode ? '#B0BEC5' : '#1565C0' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setAddDoctorOpen(false)}
            sx={{ color: darkMode ? '#B0BEC5' : '#1565C0' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddDoctorSubmit}
            variant="contained"
            disabled={addDoctorLoading}
            sx={{
              bgcolor: "#1976D2",
              "&:hover": { bgcolor: "#1565C0" }
            }}
          >
            {addDoctorLoading ? <CircularProgress size={24} color="inherit" /> : "Add Doctor"}
          </Button>
        </DialogActions>
      </Dialog>
      <Container maxWidth="lg" sx={{ p: 3 }}>
        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "auto", color: '#1976D2' }} />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !doctorData ? (
          <Alert severity="warning">
            No doctor data available. Please check your authentication and try again.
          </Alert>
        ) : (
          <>
            <HeroSection doctorData={doctorData} />
            <DoctorDetailsSection doctorData={doctorData} darkMode={darkMode} />
            
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 3,
                mt: 4,
              }}
            >
              {/* <StatCard
                icon={<EventAvailable fontSize="large" />}
                title="Upcoming Appointments"
                value="12"
                color="#1976D2"
                darkMode={darkMode}
              />
              <StatCard
                icon={<People fontSize="large" />}
                title="Patients Today"
                value="5"
                color="#0288D1"
                darkMode={darkMode}
              />
              <StatCard
                icon={<ReceiptLong fontSize="large" />}
                title="Prescriptions This Month"
                value="47"
                color="#01579B"
                darkMode={darkMode}
              /> */}
            </Box>
          </>
        )}
      </Container>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={darkMode ? "dark" : "light"}
      />
    </Box>
  );
}

const StatCard = ({ icon, title, value, color, darkMode }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      textAlign: "center",
      bgcolor: darkMode ? "#1B263B" : "#BBDEFB",
      borderTop: `4px solid ${color}`,
      transition: "transform 0.3s",
      "&:hover": {
        transform: "translateY(-5px)",
      },
    }}
  >
    <Box
      sx={{
        color: color,
        mb: 1,
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" sx={{ mb: 1, color: darkMode ? '#FFF' : '#0D1B2A' }}>
      {title}
    </Typography>
    <Typography variant="h4" fontWeight="bold" sx={{ color: darkMode ? '#FFF' : '#0D1B2A' }}>
      {value}
    </Typography>
  </Paper>
);

const HeroSection = ({ doctorData }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <Box
      sx={{
        position: "relative",
        height: { xs: "200px", md: "350px" },
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        mb: 4,
      }}
    >
      <Box
        component="img"
        src={`${process.env.PUBLIC_URL}/assets/images/docprofile.jpg`}
        alt="Doctor Background"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(70%)",
        }}
      />
      <Box
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          zIndex: 1,
          px: 2,
          color: "#fff",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ textShadow: "2px 2px 6px rgba(0,0,0,0.8)" }}
        >
          Welcome, {doctorData?.firstName || "Loading..."}{" "}
          {doctorData?.lastName || ""}
        </Typography>
        <Typography
          variant="h5"
          sx={{ mt: 1, textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
        >
          Specialization: {doctorData?.specialization || "Loading..."}
        </Typography>
      </Box>
    </Box>
  </motion.div>
);

const DoctorDetailsSection = ({ doctorData, darkMode }) => (
  <Paper
    elevation={3}
    sx={{
      mt: "20px",
      p: "20px",
      backgroundColor: darkMode ? "#1B263B" : "#BBDEFB",
      color: darkMode ? "#f0f0f0" : "#0D1B2A",
      borderRadius: "8px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    }}
  >
    <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: darkMode ? '#FFF' : '#0D1B2A' }}>
      Doctor Information
    </Typography>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px",
      }}
    >
      <Typography variant="body1" sx={{ color: darkMode ? '#FFF' : '#0D1B2A' }}>
        📧 <strong>Email:</strong> {doctorData?.email}
      </Typography>
      <Typography variant="body1" sx={{ color: darkMode ? '#FFF' : '#0D1B2A' }}>
        📞 <strong>Phone:</strong> {doctorData?.phoneNumber}
      </Typography>
      <Typography variant="body1" sx={{ color: darkMode ? '#FFF' : '#0D1B2A' }}>
        📍 <strong>City:</strong> {doctorData?.city}
      </Typography>
      <Typography variant="body1" sx={{ color: darkMode ? '#FFF' : '#0D1B2A' }}>
        🏥 <strong>State:</strong> {doctorData?.state}
      </Typography>
      <Typography variant="body1" sx={{ color: darkMode ? '#FFF' : '#0D1B2A' }}>
        🌍 <strong>Country:</strong> {doctorData?.country}
      </Typography>
      <Typography variant="body1" sx={{ color: darkMode ? '#FFF' : '#0D1B2A' }}>
        🩸 <strong>Blood Group:</strong> {doctorData?.bloodGroup}
      </Typography>
    </Box>
  </Paper>
);

export default DoctorProfile;