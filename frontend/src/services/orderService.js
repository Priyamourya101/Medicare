// src/services/orderService.js
import axiosInstance from "../api/axiosConfig";

export const placeOrder = async (orderData) => {
  try {
    console.log("orderService - placeOrder called with:", orderData);
    console.log("orderService - orderData JSON:", JSON.stringify(orderData));

    const { patientId, ...orderRequest } = orderData;

    const response = await axiosInstance.post("/api/orders", orderRequest);
    console.log("orderService - placeOrder response:", response.data);
    return response.data;
  } catch (error) {
    console.error("orderService - placeOrder error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Failed to place order");
  }
};

export const getOrdersByPatient = async (patientId) => {
  try {
    const response = await axiosInstance.get(
      `/api/orders/patient/${patientId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

export const updateOrder = async (orderId, orderData) => {
  if (!orderId) throw new Error("Order ID is undefined. Cannot update order.");

  try {
    const response = await axiosInstance.put(
      `/api/orders/${orderId}`,
      orderData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to update order ${orderId}:`,
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to update order");
  }
};

export const deleteOrder = async (orderId) => {
  if (!orderId) throw new Error("Order ID is undefined. Cannot delete order.");

  try {
    console.log(`Deleting order ID: ${orderId}`);
    await axiosInstance.delete(`/api/orders/${orderId}`);
    console.log(`Order ${orderId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error(
      `Failed to delete order ${orderId}:`,
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to delete order");
  }
};

export const checkBackendHealth = async () => {
  const healthEndpoints = [
    "/api/health",
    "/api/status",
    "/api/orders/health",
    "/api/admin/health",
  ];

  console.log("=== CHECKING BACKEND HEALTH ===");
  const results = [];

  for (const endpoint of healthEndpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await axiosInstance.get(endpoint);
      console.log(`✅ ${endpoint} - SUCCESS:`, response.data);
      results.push({ endpoint, status: "SUCCESS", data: response.data });
    } catch (error) {
      console.log(
        `❌ ${endpoint} - FAILED: ${error.response?.status} - ${error.response?.statusText}`
      );
      results.push({
        endpoint,
        status: "FAILED",
        error: error.response?.status,
      });
    }
  }

  return results;
};

export const testOrderEndpoints = async () => {
  const endpoints = [
    "/api/orders",
    "/api/admin/orders",
    "/api/orders/admin",
    "/api/admin/order/all",
    "/api/orders/all",
    "/api/order/all",
    "/api/admin/order",
    "/api/orders/list",
  ];

  console.log("=== TESTING ORDER ENDPOINTS ===");
  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing GET ${endpoint}...`);
      const response = await axiosInstance.get(endpoint);
      console.log(`✅ GET ${endpoint} - SUCCESS:`, response.data);
      results.push({
        endpoint,
        method: "GET",
        status: "SUCCESS",
        data: response.data,
      });
    } catch (error) {
      console.log(
        `❌ GET ${endpoint} - FAILED: ${error.response?.status} - ${error.response?.statusText}`
      );
      results.push({
        endpoint,
        method: "GET",
        status: "FAILED",
        error: error.response?.status,
      });
    }
  }

  return results;
};

export const getAllOrders = async () => {
  try {
    console.log("orderService - getAllOrders called");

    const possibleEndpoints = [
      "/api/admin/orders",
      "/api/orders/admin",
      "/api/orders/all",
    ];

    let response = null;
    let lastError = null;

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        response = await axiosInstance.get(endpoint);
        console.log(`Success with endpoint: ${endpoint}`);
        return response.data;
      } catch (error) {
        console.log(
          `Failed with endpoint ${endpoint}:`,
          error.response?.status,
          error.response?.statusText
        );
        lastError = error;
      }
    }

    console.error("orderService - getAllOrders error: All endpoints failed");

    const status = lastError.response?.status;
    switch (status) {
      case 405:
        throw new Error(
          "GET method not supported for orders endpoint. Please check backend API configuration."
        );
      case 500:
        throw new Error(
          "Server error: Orders service is currently unavailable"
        );
      case 401:
        throw new Error("Authentication failed. Please log in again.");
      case 403:
        throw new Error(
          "Access denied. You may not have permission to view orders."
        );
      case 404:
        throw new Error(
          "Orders endpoint not found. Please check the API configuration."
        );
      default:
        throw new Error(
          lastError.response?.data?.message || "Failed to fetch all orders"
        );
    }
  } catch (error) {
    console.error("orderService - getAllOrders final error:", error);
    throw error;
  }
};
