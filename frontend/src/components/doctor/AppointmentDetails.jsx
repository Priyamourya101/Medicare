import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LocalPharmacy, ArrowBack } from '@mui/icons-material';

const AppointmentDetails = () => {
  const { id: appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/hospital/api/appointments/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
          }
        );
        setAppointment(response.data);
        setPrescription(response.data.prescription || '');
        setStatus(response.data.status || 'PENDING');
      } catch (error) {
        console.error('Error fetching appointment details:', error);
        setError('Failed to load appointment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:8080/hospital/api/doctor/appointments/${appointmentId}`,
        { prescription, status },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
      setSuccess(true);
      setTimeout(() => navigate('/doctor/appointments'), 2000);
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = () => {
    navigate(`/doctor/appointments/${appointmentId}/prescription`);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress color="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!appointment) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">No appointment data found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, bgcolor: '#BBDEFB', color: '#0D1B2A' }}>
        <nav className="bg-blue-600 p-4 rounded-t-lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/doctor/appointments')}
              className="text-white hover:bg-blue-700"
              sx={{ color: '#FFFFFF', '&:hover': { bgcolor: '#1E88E5' } }}
            >
              Back to Appointments
            </Button>
            <Button
              variant="contained"
              startIcon={<LocalPharmacy />}
              onClick={handleCreatePrescription}
              className="bg-blue-700 hover:bg-blue-800 text-white"
              sx={{ bgcolor: '#1E88E5', '&:hover': { bgcolor: '#1976D2' } }}
            >
              Create Prescription
            </Button>
          </Box>
        </nav>

        <Typography variant="h4" gutterBottom sx={{ color: '#0D1B2A', mt: 3 }}>
          Appointment Details
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#0D1B2A' }}>
            <strong>Patient:</strong> {appointment.patientName}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#0D1B2A' }}>
            <strong>Date & Time:</strong> {new Date(appointment.date).toLocaleDateString()} at{' '}
            {appointment.time}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#0D1B2A' }}>
            <strong>Reason:</strong> {appointment.reason}
          </Typography>
        </Box>

        <TextField
          label="Prescription Notes"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#42A5F5' }, '&:hover fieldset': { borderColor: '#1565C0' }, '&.Mui-focused fieldset': { borderColor: '#1976D2' } }, '& .MuiInputLabel-root': { color: '#1565C0' } }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: '#1565C0' }}>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#42A5F5' }, '&:hover fieldset': { borderColor: '#1565C0' }, '&.Mui-focused fieldset': { borderColor: '#1976D2' } }, '& .MuiSelect-select': { color: '#0D1B2A' } }}
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={loading}
            sx={{ bgcolor: '#1976D2', '&:hover': { bgcolor: '#1565C0' } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mt: 2, bgcolor: '#E8F5E9', color: '#0D1B2A' }}>
            Appointment updated successfully!
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default AppointmentDetails;