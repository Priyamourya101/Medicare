import axiosInstance from "../api/axiosConfig";

// Function to get products for patients (public catalog)
export const getProductsForPatients = async () => {
  try {
    console.log('inventoryService - Fetching products for patients...');
    const response = await axiosInstance.get('/api/products');
    console.log('inventoryService - Products response:', response.data);
    return response.data;
  } catch (error) {
    console.error('inventoryService - Products error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 404) {
      throw new Error('Product catalog not available. Please contact support.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error: Unable to fetch products. Please try again later.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }
};

export const getAllInventoryItems = async () => {
  try {
    console.log('inventoryService - Fetching inventory items...');
    
    // Try the patient endpoint first
    try {
      const response = await axiosInstance.get('/api/inventory');
      console.log('inventoryService - Patient endpoint response:', response.data);
      return response.data;
    } catch (patientError) {
      console.log('inventoryService - Patient endpoint failed:', patientError.response?.status);
      
      // Fallback to admin endpoint
      console.log('inventoryService - Trying admin endpoint...');
      const adminResponse = await axiosInstance.get('/api/admin/inventory');
      console.log('inventoryService - Admin endpoint response:', adminResponse.data);
      return adminResponse.data;
    }
  } catch (error) {
    console.error('inventoryService - Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 500) {
      throw new Error('Server error: Unable to fetch inventory items. Please try again later.');
    } else if (error.response?.status === 404) {
      throw new Error('Inventory endpoint not found. Please contact support.');
    } else if (error.response?.status === 401) {
      throw new Error('Authentication required to view inventory items.');
    } else if (error.response?.status === 403) {
      throw new Error('Access denied: You may not have permission to view inventory items.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to fetch inventory items');
    }
  }
};

export const getInventoryItemById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/admin/inventory/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch inventory item');
  }
};

export const searchInventoryItems = async (searchTerm) => {
  try {
    const response = await axiosInstance.get(`/api/admin/inventory/search?searchTerm=${searchTerm}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search inventory items');
  }
}; 