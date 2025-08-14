import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  ThemeProvider,
  createTheme,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  CalendarToday,
  LocalPharmacy,
  Feedback as FeedbackIcon,
  DarkMode,
  LightMode,
  Person,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import LogoutButton from "./LogoutButton";

const drawerWidth = 240;
const collapsedWidth = 72;

const sidebarItems = [
  { key: "profile", label: "Doctor Profile", icon: <Home />, path: "/doctor/profile" },
  { key: "view-appointments", label: "View Appointments", icon: <CalendarToday />, path: "/doctor/appointments" },
  { key: "issue-prescription", label: "Issue Prescription", icon: <LocalPharmacy />, path: "/doctor/appointments/:id/prescription" },
  { key: "feedback", label: "Feedback", icon: <FeedbackIcon />, path: "/doctor/feedback" },
];

const DoctorLayout = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState("profile");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const navigate = useNavigate();

  // Create theme with blue color palette
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#64b5f6" : "#1565c0", // Blue tones for primary
        light: darkMode ? "#90caf9" : "#42a5f5",
        dark: darkMode ? "#0288d1" : "#0d47a1",
      },
      background: {
        default: darkMode ? "#0d1a26" : "#e3f2fd", // Blue-toned backgrounds
        paper: darkMode ? "#1c2526" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#e3f2fd" : "#102a44", // High-contrast text with blue tint
        secondary: darkMode ? "#b3e5fc" : "#455a64",
      },
      action: {
        hover: darkMode ? "#263238" : "#bbdefb",
        selected: darkMode ? "#0288d1" : "#90caf9",
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? "#1c2526" : "#ffffff", // Blue-toned sidebar
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: darkMode ? "#e3f2fd" : "#102a44",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: darkMode ? "#e3f2fd" : "#102a44",
            backgroundColor: darkMode ? "#1c2526" : "#ffffff",
          },
        },
      },
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axiosInstance.get("/api/doctors/mydetails");
        setDoctor(res.data);
      } catch (err) {
        console.error("Failed to fetch doctor info", err);
      }
    };
    fetchDoctor();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClick = (componentKey) => {
    setActiveComponent(componentKey);
    const item = sidebarItems.find(item => item.key === componentKey);
    if (item) {
      navigate(item.path);
    }
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleThemeToggle = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const drawerContent = (
    <Box sx={{ overflow: "auto" }}>
      <List>
        {sidebarItems.map((item) => (
          <ListItem
            key={item.key}
            onClick={() => handleSidebarClick(item.key)}
            sx={{
              backgroundColor:
                activeComponent === item.key
                  ? theme.palette.action.selected
                  : "transparent",
              "&:hover": { backgroundColor: theme.palette.action.hover },
              color: theme.palette.text.primary,
              cursor: 'pointer',
            }}
            aria-current={activeComponent === item.key ? "page" : undefined}
          >
            <Tooltip title={collapsed && !isMobile ? item.label : ""} placement="right" arrow>
              <ListItemIcon
                sx={{
                  color: theme.palette.text.primary,
                  minWidth: 0,
                  mr: collapsed && !isMobile ? "auto" : 2,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            {!collapsed && (
              <ListItemText
                primary={item.label}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  },
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: theme.palette.divider }} />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
        <CssBaseline />

        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)` },
            ml: { md: `${collapsed ? collapsedWidth : drawerWidth}px` },
            background: darkMode
              ? "linear-gradient(90deg, #0d1a26, #1565c0)" // Blue gradient for dark mode
              : "linear-gradient(90deg, #1565c0, #42a5f5)", // Blue gradient for light mode
            transition: "width 0.3s, margin-left 0.3s",
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Left: Menu Button + Hospital Name */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={handleDrawerToggle}
                color="inherit"
                aria-label="toggle drawer"
              >
                {isMobile ? <MenuIcon /> : collapsed ? <ChevronRight /> : <ChevronLeft />}
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                MediCare Doctor Portal
              </Typography>
            </Box>

            {/* Right: Theme, Avatar, Name, Logout */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
                <IconButton
                  onClick={handleThemeToggle}
                  color="inherit"
                  aria-label="toggle dark mode"
                >
                  {darkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
              <Avatar src="https://cdn-icons-png.freepik.com/256/2894/2894807.png?ga=GA1.1.1973256367.1748951813" />
              <Typography
                variant="body1"
                sx={{ whiteSpace: "nowrap", color: theme.palette.text.primary }}
              >
                {doctor ? `${doctor.firstName} ${doctor.lastName}` : "Doctor"}
              </Typography>
              <LogoutButton sx={{ color: "#d32f2f", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" } }} />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Box component="nav" sx={{ width: { md: collapsed ? collapsedWidth : drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={mobileOpen || !isMobile}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "block" },
              "& .MuiDrawer-paper": {
                width: collapsed && !isMobile ? collapsedWidth : drawerWidth,
                boxSizing: "border-box",
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                overflowX: "hidden",
                transition: "width 0.3s",
                borderRight: `1px solid ${theme.palette.divider}`,
                top: "64px",
                height: "calc(100vh - 64px)",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            mt: 8,
            width: { md: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)` },
            transition: "width 0.3s, margin-left 0.3s",
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.background.paper,
              p: 2,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DoctorLayout;