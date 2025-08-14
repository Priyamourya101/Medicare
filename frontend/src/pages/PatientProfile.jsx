import React, { useEffect, useState } from "react";
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
  Fade,
  Grow,
  CircularProgress,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Card,
  CardContent,
  Divider,
  InputBase,
  alpha,
  Switch,
  Zoom,
} from "@mui/material";
import {
  Home,
  CalendarToday,
  LocalPharmacy,
  Feedback as FeedbackIcon,
  Menu,
  ShoppingCart,
  Search,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";

import PatientDetails from "../components/patient/PatientDetails";
import BookAppointment from "../components/patient/BookAppointment";
import ViewAppointments from "../components/patient/ViewAppointments";
import Prescriptions from "../components/patient/Prescriptions";
import Feedback from "../components/patient/Feedback";
import OrderPage from "./OrderPage";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";
import { fetchPatientDetails } from "../services/patientService";

const sidebarItems = [
  { key: "profile", label: "Patient Profile", icon: <Home /> },
  { key: "book-appointment", label: "Book Appointment", icon: <CalendarToday /> },
  { key: "view-appointments", label: "View Appointments", icon: <CalendarToday /> },
  { key: "prescriptions", label: "Prescriptions", icon: <LocalPharmacy /> },
  { key: "orders", label: "My Orders", icon: <ShoppingCart /> },
  { key: "feedback", label: "Feedback", icon: <FeedbackIcon /> },
];

const HeroSection = ({ userData }) => {
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "200px", sm: "250px", md: "350px" },
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        mb: 4,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        component="img"
        src="https://plus.unsplash.com/premium_vector-1682270091935-677cd4ff2f4e?q=80&w=2320&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Hospital Background"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(60%)",
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
        }}
      >
        <Zoom in={true} timeout={800}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "#fff",
              fontWeight: 700,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Welcome, {userData.firstName}!
          </Typography>
        </Zoom>
        <Zoom in={true} timeout={1000}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#fff",
              mt: 1,
              fontSize: { xs: "1rem", sm: "1.2rem" },
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Your health, our commitment.
          </Typography>
        </Zoom>
      </Box>
    </Box>
  );
};

const Footer = () => (
  <Box
    sx={{
      mt: 4,
      py: 3,
      background: "linear-gradient(180deg, #2C3E50, #4e54c8)",
      color: "#fff",
      textAlign: "center",
      borderRadius: 2,
    }}
  >
    <Typography variant="body2">
      © {new Date().getFullYear()} MediCare. All rights reserved.
    </Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>
      Contact us: support@MediCare.com | +91 9637057818
    </Typography>
  </Box>
);

function PatientProfile() {
  const [userData, setUserData] = useState({});
  const [activeComponent, setActiveComponent] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const drawerWidth = 260;

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#42a5f5" : "#1976d2",
      },
      secondary: {
        main: "#f50057",
      },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#e0e0e0" : "#212121",
        secondary: darkMode ? "#b0bec5" : "#424242",
      },
      action: {
        hover: darkMode ? "#37474f" : "#e3f2fd",
        selected: darkMode ? "#0288d1" : "#bbdefb",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h3: { fontWeight: 700 },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        },
      },
    },
  });

  const handleSidebarClick = (component) => {
    setActiveComponent(component);
    if (mobileOpen) setMobileOpen(false);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const getPatientData = async () => {
    try {
      const data = await fetchPatientDetails();
      setUserData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setError("Failed to load patient data. Please log in again.");
      sessionStorage.clear();
      navigate("/LifeBridgeHospital/login");
    }
  };

  useEffect(() => {
    getPatientData();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography align="center" color="error" sx={{ mt: 8, fontSize: "1.2rem" }}>
        {error}
      </Typography>
    );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
          py: 1,
          px: { xs: 1, sm: 2 },
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 1 }}
            >
              <Menu />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: 600,
                display: { xs: "none", sm: "block" },
              }}
            >
              MediCare
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: alpha(theme.palette.common.white, 0.15),
                borderRadius: 2,
                px: 1,
                py: 0.5,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.white, 0.25),
                },
              }}
            >
              <Search sx={{ color: "inherit", mr: 1 }} />
              <InputBase
                placeholder="Search…"
                sx={{ color: "inherit", width: { xs: "100px", sm: "200px" } }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
              <Switch checked={darkMode} onChange={handleThemeToggle} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1533/1533506.png"
                alt="Patient"
                style={{
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  objectFit: "cover",
                  border: "2px solid #fff",
                }}
              />
              <Typography
                variant="body1"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {userData.firstName} {userData.lastName}
              </Typography>
              <LogoutButton />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "linear-gradient(180deg, #2C3E50, #4e54c8)",
              color: "#fff",
              borderRight: "none",
              boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
            },
          }}
        >
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Menu
            </Typography>
          </Box>
          <Divider sx={{ backgroundColor: alpha("#fff", 0.2) }} />
          <List sx={{ mt: 2 }}>
            {sidebarItems.map((item, index) => (
              <React.Fragment key={item.key}>
                <ListItem
                  onClick={() => handleSidebarClick(item.key)}
                  sx={{
                    backgroundColor:
                      activeComponent === item.key
                        ? theme.palette.action.selected
                        : "transparent",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.action.hover, 0.7),
                      transform: "translateX(5px)",
                      transition: "all 0.2s ease-in-out",
                    },
                    color: "#fff",
                    cursor: "pointer",
                    py: 1.5,
                    borderRadius: "0 20px 20px 0",
                    mx: 1,
                  }}
                  aria-current={activeComponent === item.key ? "page" : undefined}
                >
                  <ListItemIcon>
                    {React.cloneElement(item.icon, { style: { color: "#fff" } })}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                {index < sidebarItems.length - 1 && (
                  <Divider sx={{ backgroundColor: alpha("#fff", 0.1), my: 0.5 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, bgcolor: theme.palette.background.default }}>
          <Container maxWidth="lg">
            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                {activeComponent === "profile" && (
                  <Grow in={true} timeout={1000}>
                    <Box>
                      <HeroSection userData={userData} />
                      <PatientDetails userData={userData} />
                    </Box>
                  </Grow>
                )}
                {activeComponent === "book-appointment" && (
                  <Fade in={true} timeout={1000}>
                    <Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        Book Appointment
                      </Typography>
                      <BookAppointment />
                    </Box>
                  </Fade>
                )}
                {activeComponent === "view-appointments" && (
                  <Fade in={true} timeout={1000}>
                    <Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        Your Appointments
                      </Typography>
                      <ViewAppointments />
                    </Box>
                  </Fade>
                )}
                {activeComponent === "prescriptions" && (
                  <Fade in={true} timeout={1000}>
                    <Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        Prescriptions
                      </Typography>
                      <Prescriptions />
                    </Box>
                  </Fade>
                )}
                {activeComponent === "orders" && (
                  <Fade in={true} timeout={1000}>
                    <Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        My Orders
                      </Typography>
                      <OrderPage userData={userData} />
                    </Box>
                  </Fade>
                )}
                {activeComponent === "feedback" && (
                  <Fade in={true} timeout={1000}>
                    <Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        Feedback
                      </Typography>
                      <Feedback />
                    </Box>
                  </Fade>
                )}
              </CardContent>
            </Card>
            <Footer />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default PatientProfile;