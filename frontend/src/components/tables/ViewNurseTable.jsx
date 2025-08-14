import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Person,
  LocalHospital,
} from "@mui/icons-material";

// Sample data for fallback
const sampleNurseList = [
  {
    id: 1,
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
  },
  {
    id: 2,
    fullName: "Anita Sharma",
    email: "anita.sharma@example.com",
    phone: "8765432109",
    licenseNumber: "NUR002",
    specialization: "Pediatric Nursing",
    department: "Pediatrics",
    shift: "Morning (6 AM - 2 PM)",
    experience: 8,
    education: "BSc Nursing, Pediatric Certification",
    address: "456 Health Street, Delhi",
    city: "Delhi",
    state: "Delhi",
    dateOfBirth: "1988-12-20",
    hireDate: "2016-07-15",
    salary: 52000,
    emergencyContact: "Vikram Sharma",
    emergencyPhone: "8765432110",
  },
  {
    id: 3,
    fullName: "Meera Reddy",
    email: "meera.reddy@example.com",
    phone: "9988776655",
    licenseNumber: "NUR003",
    specialization: "Emergency Room",
    department: "Emergency",
    shift: "Rotating",
    experience: 3,
    education: "BSc Nursing, Emergency Care",
    address: "789 Hospital Road, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    dateOfBirth: "1992-05-10",
    hireDate: "2020-01-10",
    salary: 38000,
    emergencyContact: "Krishna Reddy",
    emergencyPhone: "9988776656",
  },
  {
    id: 4,
    fullName: "Sunita Verma",
    email: "sunita.verma@example.com",
    phone: "9123456780",
    licenseNumber: "NUR004",
    specialization: "Maternity Nursing",
    department: "Maternity",
    shift: "Day (8 AM - 4 PM)",
    experience: 6,
    education: "BSc Nursing, Midwifery",
    address: "321 Care Avenue, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    dateOfBirth: "1991-03-25",
    hireDate: "2018-09-01",
    salary: 42000,
    emergencyContact: "Ramesh Verma",
    emergencyPhone: "9123456781",
  },
  {
    id: 5,
    fullName: "Lakshmi Devi",
    email: "lakshmi.devi@example.com",
    phone: "7012345678",
    licenseNumber: "NUR005",
    specialization: "Surgical Nursing",
    department: "Surgery",
    shift: "Afternoon (2 PM - 10 PM)",
    experience: 4,
    education: "BSc Nursing, Surgical Care",
    address: "654 Operation Lane, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    dateOfBirth: "1989-11-12",
    hireDate: "2019-12-01",
    salary: 40000,
    emergencyContact: "Venkatesh Devi",
    emergencyPhone: "7012345679",
  },
];

const specializationColor = (specialization) => {
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
    case "Cardiac Care":
      return "error";
    case "Oncology Nursing":
      return "secondary";
    case "Psychiatric Nursing":
      return "default";
    case "Geriatric Nursing":
      return "warning";
    case "ICU Nursing":
      return "error";
    case "NICU Nursing":
      return "primary";
    case "Operating Room":
      return "info";
    case "Recovery Room":
      return "success";
    case "Home Health":
      return "default";
    default:
      return "default";
  }
};

const ViewNurseTable = ({ 
  nurseList = sampleNurseList, 
  onView, 
  onEdit, 
  onDelete,
  showActions = true 
}) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>License</TableCell>
            <TableCell>Specialization</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Shift</TableCell>
            <TableCell>Experience</TableCell>
            <TableCell>Salary</TableCell>
            {showActions && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {nurseList.map((nurse, index) => (
            <TableRow key={nurse.id} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocalHospital color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="body2" fontWeight="medium">
                    {nurse.fullName}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={nurse.licenseNumber}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={nurse.specialization}
                  color={specializationColor(nurse.specialization)}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>{nurse.department}</TableCell>
              <TableCell>
                <Typography variant="body2" color="textSecondary">
                  {nurse.shift}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {nurse.experience} years
                </Typography>
              </TableCell>
              <TableCell>
                ₹{nurse.salary?.toLocaleString() || "N/A"}
              </TableCell>
              {showActions && (
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onView && onView(nurse)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Nurse">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => onEdit && onEdit(nurse)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Nurse">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete && onDelete(nurse)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViewNurseTable; 