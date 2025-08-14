import React, { useState, useEffect, useCallback } from 'react';
import {
  getOrdersByPatient,
  placeOrder,
  updateOrder,
  deleteOrder
} from '../services/orderService';
import { getAllInventoryItems, getProductsForPatients } from '../services/inventoryService';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../api/axiosConfig';

const OrderPage = ({ userData }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    inventoryId: '',
    quantity: 1,
    status: 'PENDING'
  });
  const [inventoryItems, setInventoryItems] = useState([]);

  // Get patient ID from userData prop
  const patientId = userData?.id || userData?.patientId || userData?.patient_id;

  // Debug logging
  console.log('OrderPage - userData:', userData);
  console.log('OrderPage - patientId:', patientId);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if token exists
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching orders for patient ID:', patientId);
      console.log('Token exists:', !!token);
      
      const data = await getOrdersByPatient(patientId);
      setOrders(data);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      
      // Don't redirect to login, just show error
      if (err.response?.status === 401) {
        setError('Authentication failed. Please refresh the page or log in again.');
      } else {
        setError('Failed to load orders. Please try again.');
      }
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const fetchInventoryItems = useCallback(async () => {
    try {
      setInventoryLoading(true);
      
      // Check if token exists
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error('No token found for inventory fetch');
        setError('Authentication required. Please log in again.');
        return;
      }
      
      // Try to get products for patients first
      try {
        console.log('Fetching products for patients...');
        const data = await getProductsForPatients();
        setInventoryItems(data);
        console.log('Products loaded successfully:', data);
      } catch (productsError) {
        console.log('Products endpoint failed, trying inventory fallback...');
        
        // Fallback to inventory items if products endpoint doesn't exist
        try {
          const data = await getAllInventoryItems();
          setInventoryItems(data);
        } catch (inventoryError) {
          console.error('Both products and inventory endpoints failed');
          
          // Provide sample inventory items for testing
          console.log('Using sample inventory items for testing');
          setInventoryItems([
            { id: 1, name: 'Paracetamol 500mg', quantity: 100, unit: 'tablets' },
            { id: 2, name: 'Ibuprofen 400mg', quantity: 50, unit: 'tablets' },
            { id: 3, name: 'Bandages', quantity: 200, unit: 'pieces' },
            { id: 4, name: 'Syringes 5ml', quantity: 75, unit: 'pieces' },
            { id: 5, name: 'Gauze Pads', quantity: 150, unit: 'pieces' }
          ]);
        }
      }
    } catch (err) {
      console.error('Error fetching inventory items:', err);
      
      if (err.response?.status === 401) {
        console.error('Authentication failed for inventory fetch');
        // Provide sample inventory items for testing
        console.log('Using sample inventory items for testing');
        setInventoryItems([
          { id: 1, name: 'Paracetamol 500mg', quantity: 100, unit: 'tablets' },
          { id: 2, name: 'Ibuprofen 400mg', quantity: 50, unit: 'tablets' },
          { id: 3, name: 'Bandages', quantity: 200, unit: 'pieces' },
          { id: 4, name: 'Syringes 5ml', quantity: 75, unit: 'pieces' },
          { id: 5, name: 'Gauze Pads', quantity: 150, unit: 'pieces' }
        ]);
      } else if (err.response?.status === 403) {
        console.error('Access denied for inventory fetch');
        setError('Access denied. You may not have permission to view inventory items.');
      } else {
        console.error('Other error fetching inventory:', err.message);
        // Provide sample inventory items for testing
        console.log('Using sample inventory items for testing');
        setInventoryItems([
          { id: 1, name: 'Paracetamol 500mg', quantity: 100, unit: 'tablets' },
          { id: 2, name: 'Ibuprofen 400mg', quantity: 50, unit: 'tablets' },
          { id: 3, name: 'Bandages', quantity: 200, unit: 'pieces' },
          { id: 4, name: 'Syringes 5ml', quantity: 75, unit: 'pieces' },
          { id: 5, name: 'Gauze Pads', quantity: 150, unit: 'pieces' }
        ]);
      }
    } finally {
      setInventoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userData) {
      setError('User data not available. Please wait...');
      setLoading(false);
      return;
    }
    
    if (patientId) {
      fetchOrders();
      fetchInventoryItems();
    } else {
      setError('Patient ID not found. Please log in again.');
      setLoading(false);
    }
  }, [patientId, userData, fetchOrders, fetchInventoryItems]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        {error.includes('inventory') && (
          <Alert severity="info" sx={{ mb: 2 }}>
            You can still view your existing orders, but adding new orders may be limited.
          </Alert>
        )}
      </Container>
    );
  }

  const handleOpenDialog = (order = null) => {
    if (order) {
      // Use orderId for editing reference
      setEditingOrder({ ...order, id: order.orderId || order.id });
      setFormData({
        inventoryId: order.inventoryItem?.id || '',
        quantity: order.quantity,
        status: order.status
      });
    } else {
      setEditingOrder(null);
      setFormData({
        inventoryId: '',
        quantity: 1,
        status: 'PENDING'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOrder(null);
    setFormData({
      inventoryId: '',
      quantity: 1,
      status: 'PENDING'
    });
  };

  // const handleSubmit = async () => {
  //   try {
  //     // Validate required fields
  //     if (!formData.inventoryId || !formData.quantity) {
  //       toast.error('Please fill in all required fields');
  //       return;
  //     }

  //     // Validate patient ID
  //     if (!patientId) {
  //       toast.error('Patient ID is missing. Please log in again.');
  //       return;
  //     }

  //     // Check if selected inventory item exists and has sufficient stock
  //     const selectedItem = inventoryItems.find(item => item.id === parseInt(formData.inventoryId));
  //     if (!selectedItem) {
  //       toast.error('Selected inventory item not found');
  //       return;
  //     }

  //     if (selectedItem.quantity < parseInt(formData.quantity)) {
  //       toast.error(`Insufficient stock. Only ${selectedItem.quantity} ${selectedItem.unit} available.`);
  //       return;
  //     }

  //     // Convert string IDs to numbers
  //     const orderData = {
  //       inventoryId: parseInt(formData.inventoryId),
  //       quantity: parseInt(formData.quantity),
  //       status: formData.status
  //     };

  //     // Debug logging
  //     console.log('=== ORDER SUBMISSION DEBUG ===');
  //     console.log('patientId:', patientId);
  //     console.log('patientId type:', typeof patientId);
  //     console.log('formData:', formData);
  //     console.log('selectedItem:', selectedItem);
  //     console.log('orderData:', orderData);
  //     console.log('Available inventory items:', inventoryItems);

  //     if (editingOrder) {
  //       // Update existing order
  //       console.log('Updating order with data:', orderData);
  //       await updateOrder(editingOrder.id, orderData);
  //       toast.success('Order updated successfully');
  //     } else {
  //       // Create new order - backend will get patientId from authentication
  //       const orderData = {
  //         inventoryId: parseInt(formData.inventoryId),
  //         quantity: parseInt(formData.quantity),
  //         status: formData.status
  //       };
        
  //       console.log('Creating new order with data:', orderData);
  //       await placeOrder(orderData);
  //       toast.success('Order placed successfully');
  //     }
  //     handleCloseDialog();
  //     fetchOrders();
  //   } catch (err) {
  //     console.error('Error saving order:', err);
  //     console.error('Error details:', err.response?.data);
  //     toast.error(err.message || 'Failed to save order');
  //   }
  // };
const handleSubmit = async () => {
  try {
    // Validate required fields
    if (!formData.inventoryId || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate patient ID
    if (!patientId) {
      toast.error('Patient ID is missing. Please log in again.');
      return;
    }

    // Check if selected inventory item exists and has sufficient stock
    const selectedItem = inventoryItems.find(item => item.id === parseInt(formData.inventoryId));
    if (!selectedItem) {
      toast.error('Selected inventory item not found');
      return;
    }

    if (selectedItem.quantity < parseInt(formData.quantity)) {
      toast.error(`Insufficient stock. Only ${selectedItem.quantity} ${selectedItem.unit} available.`);
      return;
    }

    const orderData = {
      inventoryId: parseInt(formData.inventoryId),
      quantity: parseInt(formData.quantity),
      status: formData.status
    };

    if (editingOrder) {
      const orderIdToUpdate = editingOrder?.id || editingOrder?.orderId;
      if (!orderIdToUpdate) {
        console.error('❌ No valid order ID found for updating:', editingOrder);
        toast.error('Internal error: Missing order ID');
        return;
      }

      console.log('🔄 Updating order ID:', orderIdToUpdate, 'with data:', orderData);
      await updateOrder(orderIdToUpdate, orderData);
      toast.success('Order updated successfully');
    } else {
      console.log('🆕 Placing new order with data:', orderData);
      await placeOrder(orderData);
      toast.success('Order placed successfully');
    }

    handleCloseDialog();
    fetchOrders();
  } catch (err) {
    console.error('❌ Error saving order:', err);

    // Attempt to log backend error details
    if (err.response) {
      console.error('Backend response error:', err.response.data);
    } else {
      console.error('No backend response received');
    }

    toast.error(
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred while saving the order'
    );
  }
};

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setDeletingOrderId(orderId);
      try {
        const response = await deleteOrder(orderId);
        console.log('Delete order response:', response);
        toast.success('Order deleted successfully');
        await fetchOrders();
      } catch (err) {
        console.error('Error deleting order:', err);
        let errorMsg = 'Failed to delete order';
        if (err.response) {
          console.error('Delete order error response:', err.response.data);
          errorMsg = err.response.data?.message || errorMsg;
        } else if (err.message) {
          errorMsg = err.message;
        }
        toast.error(errorMsg);
      } finally {
        setDeletingOrderId(null);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CompletedIcon color="success" />;
      case 'PENDING':
        return <PendingIcon color="warning" />;
      case 'CANCELLED':
        return <CancelledIcon color="error" />;
      default:
        return <ShippingIcon color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      console.log('Current patientId:', patientId);
      console.log('Current inventoryItems:', inventoryItems);
      
      // Test if we can fetch orders
      const orders = await getOrdersByPatient(patientId);
      console.log('Orders fetch test result:', orders);
      
      // Test if we can fetch inventory
      const inventory = await getAllInventoryItems();
      console.log('Inventory fetch test result:', inventory);
      
      toast.success('Backend connection test completed. Check console for details.');
    } catch (err) {
      console.error('Backend connection test failed:', err);
      toast.error('Backend connection test failed: ' + err.message);
    }
  };

  const checkTokenStatus = () => {
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("userData");
    
    console.log('=== TOKEN STATUS CHECK ===');
    console.log('Token exists:', !!token);
    console.log('Token length:', token ? token.length : 0);
    console.log('UserData exists:', !!userData);
    console.log('Current userData prop:', userData);
    console.log('Patient ID from prop:', patientId);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log('Token payload:', payload);
        console.log('Token expiration:', new Date(payload.exp * 1000));
        console.log('Token is expired:', Date.now() > payload.exp * 1000);
      } catch (err) {
        console.error('Error parsing token:', err);
      }
    }
  };

  const testInventoryEndpoints = async () => {
    const endpoints = [
      '/api/products',
      '/api/inventory',
      '/api/admin/inventory',
      '/api/patient/inventory',
      '/api/inventory/items'
    ];
    
    console.log('=== TESTING INVENTORY ENDPOINTS ===');
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing ${endpoint}...`);
        const response = await axiosInstance.get(endpoint);
        console.log(`✅ ${endpoint} - SUCCESS:`, response.data);
      } catch (error) {
        console.log(`❌ ${endpoint} - FAILED: ${error.response?.status} - ${error.response?.statusText}`);
      }
    }
    
    toast.info('Check console for endpoint test results');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            My Orders
          </Typography>
          <Box>
            <Tooltip title="Refresh Orders">
              <IconButton onClick={fetchOrders} color="primary" sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Test Backend Connection">
              <IconButton onClick={() => {
                checkTokenStatus();
                testInventoryEndpoints();
                console.log('Testing backend...');
                console.log('Patient ID:', patientId);
                console.log('Inventory Items:', inventoryItems);
                toast.info('Check console for debug info');
              }} color="secondary" sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Test Admin Inventory Access">
              <IconButton onClick={async () => {
                try {
                  console.log('Testing admin inventory access...');
                  const response = await axiosInstance.get('/api/admin/inventory');
                  console.log('Admin inventory response:', response.data);
                  toast.success('Admin inventory accessible!');
                } catch (error) {
                  console.error('Admin inventory error:', error.response?.status, error.response?.data);
                  toast.error(`Admin inventory error: ${error.response?.status}`);
                }
              }} color="info" sx={{ mr: 1 }}>
                <CartIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              Place New Order
            </Button>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage your medical supply orders and track their status
        </Typography>
        {inventoryItems.length > 0 && inventoryItems[0].name === 'Paracetamol 500mg' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Using sample inventory items for demonstration. In production, these would be loaded from the server.
          </Alert>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Orders Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You haven't placed any orders yet. Start by placing your first order.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Place Your First Order
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Order Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      Order{order.id}
                    </Typography>
                    {/* <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    /> */}
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Order Details */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Item:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {order.inventoryItem?.name
                        || (order.inventoryId && (inventoryItems.find(item => item.id === order.inventoryId)?.name))
                        || 'Unknown Item'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Quantity:
                    </Typography>
                    <Typography variant="body1">
                      {order.quantity} {order.inventoryItem?.unit || 'units'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Order Date:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(order.orderDate)}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" gap={1} mt="auto">
                    <Tooltip title="Edit Order">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(order)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Order">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => {
                            const deleteId = order.orderId || order.id;
                            console.log('Delete button clicked, order.id:', order.id, 'order.orderId:', order.orderId, 'deleteId:', deleteId);
                            handleDeleteOrder(deleteId);
                          }}
                          color="error"
                          disabled={deletingOrderId === (order.orderId || order.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Order Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingOrder ? 'Edit Order' : 'Place New Order'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Inventory Item</InputLabel>
              <Select
                value={formData.inventoryId}
                onChange={(e) => setFormData({ ...formData, inventoryId: e.target.value })}
                label="Inventory Item"
                disabled={inventoryLoading}
              >
                {inventoryLoading ? (
                  <MenuItem disabled>Loading inventory items...</MenuItem>
                ) : inventoryItems.length === 0 ? (
                  <MenuItem disabled>No inventory items available</MenuItem>
                ) : (
                  inventoryItems.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name} - {item.quantity} {item.unit} available
                    </MenuItem>
                  ))
                )}
              </Select>
              {inventoryItems.length === 0 && !inventoryLoading && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="warning.main" sx={{ display: 'block', mb: 1 }}>
                    Unable to load inventory items. You may not have permission to view them.
                  </Typography>
                  <Typography variant="caption" color="info.main" sx={{ display: 'block' }}>
                    You can still place orders by entering the inventory ID manually below.
                  </Typography>
                </Box>
              )}
            </FormControl>
            
            {inventoryItems.length === 0 && !inventoryLoading && (
              <TextField
                fullWidth
                label="Inventory ID (Manual Entry)"
                value={formData.inventoryId}
                onChange={(e) => setFormData({ ...formData, inventoryId: e.target.value })}
                margin="normal"
                type="number"
                inputProps={{ min: 1 }}
                helperText="Enter the inventory item ID if you know it"
              />
            )}
            <TextField
              fullWidth
              label="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              margin="normal"
              type="number"
              inputProps={{ min: 1 }}
            />
            {/* Status field removed for Place New Order modal */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={inventoryItems.length === 0 && !editingOrder && !formData.inventoryId}
          >
            {editingOrder ? 'Update' : 'Place Order'}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default OrderPage; 