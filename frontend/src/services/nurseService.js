import axiosInstance from "../api/axiosConfig";

// Get all nurses
export const getAllNurses = async () => {
  try {
    const response = await axiosInstance.get("/api/admin/nurses");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add new nurse
export const addNurse = async (nurseData) => {
  try {
    const response = await axiosInstance.post("/api/admin/nurses", nurseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update nurse
export const updateNurse = async (nurseId, nurseData) => {
  try {
    const response = await axiosInstance.put(`/api/admin/nurses/${nurseId}`, nurseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete nurse
export const deleteNurse = async (nurseId) => {
  try {
    const response = await axiosInstance.delete(`/api/admin/nurses/${nurseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get nurse by ID
export const getNurseById = async (nurseId) => {
  try {
    const response = await axiosInstance.get(`/api/admin/nurses/${nurseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 