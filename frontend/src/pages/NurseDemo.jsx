import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle,
  Info,
  LocalHospital,
  Business,
} from "@mui/icons-material";
import NurseManagement from "../components/admin/NurseManagement";

const NurseDemo = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <LocalHospital color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" color="primary">
          Nurse Management System Demo
        </Typography>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body1">
          This is a demonstration of the nurse management system. The system includes:
        </Typography>
      </Alert>

      {/* Features List */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Features" />
        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Nurse Registration Form" 
                secondary="Comprehensive form with validation for adding new nurses"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="CRUD Operations" 
                secondary="Create, Read, Update, and Delete nurse records"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Axios Integration" 
                secondary="RESTful API calls for data persistence"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Admin Only Access" 
                secondary="Only administrators can add, edit, and delete nurses"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Nurse Details Table" 
                secondary="Display nurse information in a organized table format"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Professional Information" 
                secondary="License number, specialization, department, shift, and experience"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Form Validation" 
                secondary="Client-side validation for all required fields"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Material-UI Components" 
                secondary="Modern and responsive UI components"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Demo Instructions */}
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Demo Instructions" 
          avatar={<Info color="primary" />}
        />
        <CardContent>
          <Typography variant="body1" paragraph>
            This demo uses sample data since the backend API is not connected. In a real implementation:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Info color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Backend API" 
                secondary="Connect to your backend server at http://localhost:8080/hospital/"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Authentication" 
                secondary="Implement proper authentication and authorization"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Database" 
                secondary="Set up a database to store nurse information"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="License Verification" 
                secondary="Add license verification system for nurses"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Shift Management" 
                secondary="Implement shift scheduling and management"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Certification Tracking" 
                secondary="Track nursing certifications and renewals"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Nurse Management Component */}
      <NurseManagement />
    </Box>
  );
};

export default NurseDemo; 