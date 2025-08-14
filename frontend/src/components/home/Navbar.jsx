import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import {
  ExpandLess,
  ExpandMore,
  Home,
  Info,
  Login,
  Menu as MenuIcon,
  MoreHoriz,
  PersonAdd,
} from "@mui/icons-material";
import { Biohazard, Pill } from "lucide-react";
import { Link } from "react-router-dom";

// Hide-on-scroll behavior
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const menuOpen = Boolean(anchorEl);

  const navItems = [
    { text: "Home", to: "/", icon: <Home /> },
    { text: "About Us", to: "/about", icon: <Info /> },
    { text: "Login", to: "/login", icon: <Login /> },
    { text: "Register", to: "/register", icon: <PersonAdd /> },
    {
      text: "More",
      icon: <MoreHoriz />,
      subItems: [
        { text: "Drug Info", to: "/drug-info", icon: <Pill size={20} /> },
        {
          text: "Disease Info",
          to: "/disease-info",
          icon: <Biohazard size={20} />,
        },
      ],
    },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawerMore = () => {
    setMoreOpen(!moreOpen);
  };

  const renderNavItems = (items) =>
    items.map((item, index) => (
      <React.Fragment key={index}>
        <ListItem disablePadding>
          <ListItemButton
            component={item.to ? Link : "div"}
            to={item.to}
            onClick={() => {
              if (!item.to) toggleDrawerMore();
              else setDrawerOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                transform: 'translateX(8px)',
                transition: 'all 0.3s ease',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon sx={{ color: '#1565c0', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                '& .MuiTypography-root': { 
                  fontWeight: 500,
                  color: '#0d47a1'
                } 
              }} 
            />
            {item.subItems && (
              <Box sx={{ color: '#1565c0' }}>
                {moreOpen ? <ExpandLess /> : <ExpandMore />}
              </Box>
            )}
          </ListItemButton>
        </ListItem>

        {item.subItems && (
          <Collapse in={moreOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem, idx) => (
                <ListItem key={idx} disablePadding sx={{ pl: 4 }}>
                  <ListItemButton
                    component={Link}
                    to={subItem.to}
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.3,
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        transform: 'translateX(4px)',
                        transition: 'all 0.2s ease',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon sx={{ color: '#2196f3', minWidth: 36 }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={subItem.text}
                      sx={{ 
                        '& .MuiTypography-root': { 
                          fontWeight: 400,
                          fontSize: '0.9rem',
                          color: '#1565c0'
                        } 
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 25%, #1976d2 75%, #1e88e5 100%)',
          backdropFilter: "blur(10px)",
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(13, 71, 161, 0.4)',
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <IconButton 
            edge="start" 
            component={Link} 
            to="/" 
            sx={{ 
              mr: 2,
              p: 1,
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/logo.jpg`}
              alt="LifeBridge Hospital Logo"
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              }}
            />
          </IconButton>

          <Typography
            variant="h5"
            sx={{ 
              flexGrow: 1, 
              color: "white", 
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              letterSpacing: '0.5px',
              background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
          MediCare
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={() => setDrawerOpen(true)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'rotate(90deg)',
                    transition: 'all 0.3s ease',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                  '& .MuiDrawer-paper': {
                    background: 'linear-gradient(180deg, #cfd8dc 0%, #e0f2f1 100%)',
                    backdropFilter: 'blur(10px)',
                    borderLeft: '1px solid rgba(21, 101, 192, 0.2)',
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 280,
                    pt: 3,
                    background: 'linear-gradient(180deg, #cfd8dc 0%, #e0f2f1 100%)',
                    minHeight: '100vh',
                  }} 
                  role="presentation"
                >
                  <Typography
                    variant="h6"
                    sx={{
                      px: 2,
                      pb: 2,
                      color: '#0d47a1',
                      fontWeight: 600,
                      borderBottom: '2px solid rgba(21, 101, 192, 0.1)',
                      mb: 1,
                    }}
                  >
                    Navigation Menu
                  </Typography>
                  <List>{renderNavItems(navItems)}</List>
                </Box>
              </Drawer>
            </>
          ) : (
            <>
              {navItems.map((item, index) => {
                if (item.subItems) {
                  return (
                    <div key={index}>
                      <Button
                        color="inherit"
                        startIcon={item.icon}
                        endIcon={<ExpandMore />}
                        onClick={handleMenuOpen}
                        sx={{ 
                          ml: 1,
                          px: 3,
                          py: 1,
                          borderRadius: 3,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {item.text}
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                        sx={{
                          '& .MuiPaper-root': {
                            background: 'linear-gradient(145deg, #e3f2fd 0%, #f0f8ff 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(21, 101, 192, 0.2)',
                            borderRadius: 3,
                            boxShadow: '0 10px 30px rgba(21, 101, 192, 0.3)',
                            mt: 1,
                          }
                        }}
                      >
                        {item.subItems.map((subItem, idx) => (
                          <MenuItem
                            key={idx}
                            component={Link}
                            to={subItem.to}
                            onClick={handleMenuClose}
                            sx={{
                              borderRadius: 2,
                              mx: 1,
                              my: 0.5,
                              '&:hover': {
                                backgroundColor: 'rgba(33, 150, 243, 0.15)',
                                transform: 'translateX(5px)',
                                transition: 'all 0.2s ease',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <ListItemIcon sx={{ color: '#2196f3' }}>
                              {subItem.icon}
                            </ListItemIcon>
                            <Typography sx={{ color: '#1565c0', fontWeight: 500 }}>
                              {subItem.text}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  );
                }
                return (
                  <Button
                    key={index}
                    component={Link}
                    to={item.to}
                    startIcon={item.icon}
                    sx={{ 
                      color: "white", 
                      ml: 1,
                      px: 3,
                      py: 1,
                      borderRadius: 3,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}
            </>
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
