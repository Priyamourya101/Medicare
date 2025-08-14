// ViewAllOrders.js

import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, Chip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel,
  Select, MenuItem, Alert, CircularProgress, IconButton, Tooltip, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination
} from '@mui/material';

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Person as PersonIcon
} from '@mui/icons-material';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getAllOrders, updateOrder, deleteOrder, testOrderEndpoints, checkBackendHealth } from '../../services/orderService';

const ViewAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({ status: 'PENDING' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Showing sample data due to API issues');
      setOrders([
        {
          id: 1,
          patient: { firstName: 'John', lastName: 'Doe', email: 'john.doe@email.com', phone: '123-456-7890' },
          inventoryItem: { name: 'Paracetamol 500mg' },
          quantity: 10,
          status: 'PENDING',
          orderDate: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDialog = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setFormData({ status: order.status });
    } else {
      setEditingOrder(null);
      setFormData({ status: 'PENDING' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOrder(null);
    setFormData({ status: 'PENDING' });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.status) {
        toast.error('Please select a status');
        return;
      }

      const orderId = editingOrder?.orderId || editingOrder?.id;

      if (!orderId) {
        toast.error('No valid order ID found');
        return;
      }

      await updateOrder(orderId, { status: formData.status });
      toast.success('Order status updated');
      handleCloseDialog();
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      toast.error('Failed to update order');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Delete this order?')) {
      try {
        await deleteOrder(orderId);
        toast.success('Order deleted');
        fetchOrders();
      } catch (err) {
        console.error('Delete error:', err);
        toast.error('Delete failed');
      }
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedOrder(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CompletedIcon color="success" />;
      case 'PENDING': return <PendingIcon color="warning" />;
      case 'CANCELLED': return <CancelledIcon color="error" />;
      default: return <ShippingIcon color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'info';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color="primary" fontWeight="bold">All Patient Orders</Typography>
        <Box>
          <Tooltip title="Refresh Orders">
            <IconButton onClick={fetchOrders}><RefreshIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Test Endpoints">
            <IconButton onClick={async () => {
              try {
                const result = await testOrderEndpoints();
                console.log(result);
                toast.success('Endpoints tested');
              } catch (err) {
                toast.error('Test failed');
              }
            }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Check Health">
            <IconButton onClick={async () => {
              try {
                const result = await checkBackendHealth();
                console.log(result);
                toast.info('Health check passed');
              } catch (err) {
                toast.error('Health check failed');
              }
            }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, i) => (
              <TableRow key={i}>
                <TableCell>#{order.orderId || order.id}</TableCell>
                <TableCell>
                  <PersonIcon sx={{ fontSize: 18, mr: 1 }} />
                  {order.patientName || `${order.patient?.firstName || ''} ${order.patient?.lastName || ''}`.trim()}
                </TableCell>
                <TableCell>{order.inventoryName || order.inventoryItem?.name}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <Chip icon={getStatusIcon(order.status)} label={order.status} color={getStatusColor(order.status)} />
                </TableCell>
                <TableCell>{formatDate(order.orderDate)}</TableCell>
                <TableCell>
                  <Tooltip title="View"><IconButton onClick={() => handleViewOrder(order)}><ViewIcon /></IconButton></Tooltip>
                  <Tooltip title="Edit"><IconButton onClick={() => handleOpenDialog(order)}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton onClick={() => handleDeleteOrder(order.orderId || order.id)}><DeleteIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Edit Order Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6">Patient</Typography>
                <Typography>Name: {selectedOrder.patientName || `${selectedOrder.patient?.firstName || ''} ${selectedOrder.patient?.lastName || ''}`}</Typography>
                <Typography>Email: {selectedOrder.patientEmail || selectedOrder.patient?.email}</Typography>
                <Typography>Phone: {selectedOrder.patientPhone || selectedOrder.patient?.phone}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Order</Typography>
                <Typography>Item: {selectedOrder.inventoryName || selectedOrder.inventoryItem?.name}</Typography>
                <Typography>Quantity: {selectedOrder.quantity}</Typography>
                <Typography>Status: 
                  <Chip
                    icon={getStatusIcon(selectedOrder.status)}
                    label={selectedOrder.status}
                    color={getStatusColor(selectedOrder.status)}
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography>Date: {formatDate(selectedOrder.orderDate)}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
          <Button onClick={() => {
            handleCloseViewDialog();
            handleOpenDialog(selectedOrder);
          }} variant="contained">Edit Status</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default ViewAllOrders;
