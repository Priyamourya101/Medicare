import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
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
} from "@mui/icons-material";

const roleColor = (role) => {
  switch (role) {
    case "Nurse":
      return "primary";
    case "Doctor":
      return "success";
    case "Ward Boy":
      return "secondary";
    case "Lab Technician":
      return "success";
    case "Receptionist":
      return "info";
    case "Pharmacist":
      return "warning";
    case "Security":
      return "error";
    case "Admin":
      return "primary";
    case "Housekeeping":
      return "default";
    case "IT Support":
      return "primary";
    case "Maintenance":
      return "secondary";
    default:
      return "default";
  }
};

const ViewStaffTable = ({ 
  staffList = [], 
  onView, 
  onEdit, 
  onDelete,
  showActions = true 
}) => {
  const getFullName = (staff) => {
    if (staff.firstName && staff.lastName) {
      return `${staff.firstName} ${staff.lastName}`;
    }
    return staff.firstName || staff.lastName || "Unknown";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary) => {
    if (!salary) return "N/A";
    return `₹${salary.toLocaleString()}`;
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Hire Date</TableCell>
            <TableCell>Salary</TableCell>
            {showActions && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {staffList.map((staff, index) => (
            <TableRow key={staff.id} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Person color="primary" sx={{ fontSize: 20 }} />
                  <Typography variant="body2" fontWeight="medium">
                    {getFullName(staff)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{staff.email || "N/A"}</TableCell>
              <TableCell>{staff.phoneNumber || "N/A"}</TableCell>
              <TableCell>
                <Chip
                  label={staff.role || "N/A"}
                  color={roleColor(staff.role)}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>{staff.department || "N/A"}</TableCell>
              <TableCell>
                {formatDate(staff.hireDate)}
              </TableCell>
              <TableCell>
                {formatSalary(staff.salary)}
              </TableCell>
              {showActions && (
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onView && onView(staff)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Staff">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => onEdit && onEdit(staff)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Staff">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete && onDelete(staff)}
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

export default ViewStaffTable;
