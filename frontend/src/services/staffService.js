import axiosInstance from "../api/axiosConfig";

// Get all staff members
export const getAllStaff = async () => {
  try {
    const response = await axiosInstance.get("/api/admin/staff");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add new staff member
export const addStaff = async (staffData) => {
  try {
    const response = await axiosInstance.post("/api/admin/staff", staffData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update staff member
export const updateStaff = async (staffId, staffData) => {
  try {
    const response = await axiosInstance.put(`/api/admin/staff/${staffId}`, staffData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete staff member
export const deleteStaff = async (staffId) => {
  try {
    const response = await axiosInstance.delete(`/api/admin/staff/${staffId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get staff member by ID
export const getStaffById = async (staffId) => {
  try {
    const response = await axiosInstance.get(`/api/admin/staff/${staffId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 