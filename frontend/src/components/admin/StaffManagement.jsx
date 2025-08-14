import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Fab,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Refresh,
  Person,
  Business,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import ViewStaffTable from "../tables/ViewStaffTable";
import {
  getAllStaff,
  deleteStaff,
} from "../../services/staffService";
import StaffProfile from '../../pages/StaffProfile';

const StaffManagement = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, staff: null });
  const [viewDialog, setViewDialog] = useState({ open: false, staff: null });
  const [viewingStaffId, setViewingStaffId] = useState(null);

  // Fetch staff data on component mount
  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const data = await getAllStaff();
      setStaffList(data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("Failed to fetch staff data");
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      await deleteStaff(staffId);
      setStaffList((prev) => prev.filter((staff) => staff.id !== staffId));
      setDeleteDialog({ open: false, staff: null });
      toast.success("Staff member deleted successfully!");
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff member");
    }
  };

  const handleViewStaff = (staff) => {
    setViewingStaffId(staff.id);
  };

  const handleEditStaff = (staff) => {
    navigate(`/admin/staff/edit/${staff.id}`);
  };

  const handleDeleteClick = (staff) => {
    setDeleteDialog({ open: true, staff });
  };

  const handleAddNewStaff = () => {
    navigate("/admin/staff/register");
  };

  const handleBackToList = () => {
    setViewingStaffId(null);
    navigate("/admin/profile", { state: { tab: "manage-staff" } });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Business color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" color="primary">
            Staff Management
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchStaffData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNewStaff}
          >
            Add New Staff
          </Button>
        </Box>
      </Box>

      {/* Render StaffProfile if viewingStaffId is set, otherwise show table */}
      {viewingStaffId ? (
        <>
          <Button variant="outlined" onClick={handleBackToList} sx={{ mb: 2 }}>
            Back to Staff List
          </Button>
          <StaffProfile id={viewingStaffId} />
        </>
      ) : (
        <>
          {/* Loading State */}
          {loading && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          )}
          
          {/* Error State */}
          {!loading && staffList.length === 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box textAlign="center" py={4}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No staff members found
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Click "Add New Staff" to register the first staff member
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddNewStaff}
                    sx={{ mt: 2 }}
                  >
                    Add New Staff
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Staff Table */}
          {!loading && staffList.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person />
                    <Typography variant="h6">
                      Staff Directory ({staffList.length} members)
                    </Typography>
                  </Box>
                }
                sx={{ backgroundColor: "#f5f5f5" }}
              />
              <CardContent>
                <ViewStaffTable
                  staffList={staffList}
                  onView={handleViewStaff}
                  onEdit={handleEditStaff}
                  onDelete={handleDeleteClick}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, staff: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{deleteDialog.staff?.firstName} {deleteDialog.staff?.lastName}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, staff: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteStaff(deleteDialog.staff?.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Staff Details Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, staff: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Staff Details - {viewDialog.staff?.firstName} {viewDialog.staff?.lastName}
        </DialogTitle>
        <DialogContent>
          {viewDialog.staff && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
                <Typography><strong>Name:</strong> {viewDialog.staff.firstName} {viewDialog.staff.lastName}</Typography>
                <Typography><strong>Email:</strong> {viewDialog.staff.email}</Typography>
                <Typography><strong>Phone:</strong> {viewDialog.staff.phoneNumber}</Typography>
                <Typography><strong>Date of Birth:</strong> {viewDialog.staff.dateOfBirth}</Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Employment Information
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={3}>
                <Typography><strong>Role:</strong> {viewDialog.staff.role}</Typography>
                <Typography><strong>Department:</strong> {viewDialog.staff.department}</Typography>
                <Typography><strong>Hire Date:</strong> {viewDialog.staff.hireDate}</Typography>
                <Typography><strong>Salary:</strong> ₹{viewDialog.staff.salary?.toLocaleString()}</Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
              <Box mb={3}>
                <Typography>{viewDialog.staff.address}</Typography>
                <Typography>{viewDialog.staff.city}, {viewDialog.staff.state}</Typography>
              </Box>

              {viewDialog.staff.emergencyContact && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Emergency Contact
                  </Typography>
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                    <Typography><strong>Name:</strong> {viewDialog.staff.emergencyContact}</Typography>
                    <Typography><strong>Phone:</strong> {viewDialog.staff.emergencyPhone}</Typography>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, staff: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleAddNewStaff}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default StaffManagement; 