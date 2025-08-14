# Nurse Management System

A comprehensive nurse management system for hospital administration with CRUD operations, form validation, and Material-UI components specifically designed for nursing staff.

## Features

### ✅ Nurse Registration Form

- **Comprehensive Form Fields**: Personal information, professional details, license information, and emergency contact
- **Professional Information**: License number, specialization, department, shift, experience, and education
- **Form Validation**: Client-side validation for all required fields
- **Material-UI Components**: Modern, responsive form components
- **Error Handling**: Real-time validation feedback

### ✅ CRUD Operations

- **Create**: Add new nurses with detailed professional information
- **Read**: View nurse list in organized table format
- **Update**: Edit existing nurse information
- **Delete**: Remove nurses with confirmation

### ✅ Admin-Only Access

- **Authorization**: Only administrators can perform CRUD operations
- **Security**: Proper access control for sensitive operations

### ✅ Nurse Details Table

- **Organized Display**: Nurse information in clean table format
- **Action Buttons**: View, edit, and delete operations
- **Professional Information**: License, specialization, department, shift, experience
- **Responsive Design**: Works on all device sizes

### ✅ Axios Integration

- **RESTful API**: Proper HTTP methods for data operations
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during operations

## File Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── NurseRegistrationForm.jsx    # Nurse registration form
│   │   └── NurseManagement.jsx          # Main nurse management page
│   └── tables/
│       └── ViewNurseTable.jsx           # Nurse table component
├── services/
│   └── nurseService.js                  # API service functions
├── pages/
│   ├── NurseProfile.jsx                 # Individual nurse profile
│   └── NurseDemo.jsx                    # Demo page
└── api/
    └── axiosConfig.js                   # Axios configuration
```

## Components

### NurseRegistrationForm

A comprehensive form component for adding and editing nurses.

**Features:**

- Personal information (name, email, phone, DOB)
- Professional details (license number, specialization, department, shift, experience, education)
- Address information (address, city, state)
- Emergency contact (optional)
- Form validation with real-time feedback
- Material-UI components for modern UI

**Props:**

- `onNurseAdded`: Callback function when nurse is added/updated
- `onCancel`: Callback function for form cancellation
- `editingNurse`: Nurse object for editing mode

### NurseManagement

Main management page that combines the registration form with table view.

**Features:**

- Nurse list display with action buttons
- Add new nurse functionality
- Edit existing nurses
- Delete nurses with confirmation
- View detailed nurse information
- Loading states and error handling

### ViewNurseTable

Table component for displaying nurse information.

**Features:**

- Responsive table design
- Action buttons (view, edit, delete)
- Specialization-based color coding
- License number display
- Professional information columns
- Search and filter capabilities

**Props:**

- `nurseList`: Array of nurse objects
- `onView`: Callback for view action
- `onEdit`: Callback for edit action
- `onDelete`: Callback for delete action
- `showActions`: Boolean to show/hide action buttons

## API Service (nurseService.js)

### Functions:

- `getAllNurses()`: Fetch all nurses
- `addNurse(nurseData)`: Add new nurse
- `updateNurse(nurseId, nurseData)`: Update existing nurse
- `deleteNurse(nurseId)`: Delete nurse
- `getNurseById(nurseId)`: Get specific nurse

### API Endpoints:

- `GET /api/admin/nurses` - Get all nurses
- `POST /api/admin/nurses` - Add new nurse
- `PUT /api/admin/nurses/{id}` - Update nurse
- `DELETE /api/admin/nurses/{id}` - Delete nurse
- `GET /api/admin/nurses/{id}` - Get nurse by ID

## Form Validation

### Required Fields:

- First Name
- Last Name
- Email (with format validation)
- Phone Number (10 digits)
- License Number
- Specialization
- Department
- Shift
- Experience (years)
- Education
- Address
- City
- State
- Date of Birth
- Hire Date
- Salary (positive number)

### Validation Rules:

- Email must be in valid format
- Phone number must be 10 digits
- License number is required
- Date of birth cannot be in the future
- Hire date cannot be in the future
- Date of birth cannot be after hire date
- Salary must be a positive number
- Experience must be a positive number

## Sample Data Structure

```javascript
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
  emergencyPhone: "9876543211"
}
```

## Available Specializations

- General Nursing
- Critical Care
- Emergency Room
- Pediatric Nursing
- Maternity Nursing
- Surgical Nursing
- Cardiac Care
- Oncology Nursing
- Psychiatric Nursing
- Geriatric Nursing
- ICU Nursing
- NICU Nursing
- Operating Room
- Recovery Room
- Home Health

## Available Departments

- Emergency
- Cardiology
- Orthopedics
- Pediatrics
- General Medicine
- Surgery
- ICU
- NICU
- Maternity
- Oncology
- Psychiatry
- Geriatrics
- Recovery Room
- Operating Room
- Outpatient

## Available Shifts

- Morning (6 AM - 2 PM)
- Afternoon (2 PM - 10 PM)
- Night (10 PM - 6 AM)
- Day (8 AM - 4 PM)
- Evening (4 PM - 12 AM)
- Rotating
- On-Call

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm start
   ```

3. **Access the Demo**
   - Navigate to `/nurse-demo` to see the nurse management system
   - Or integrate components into your existing admin dashboard

## Backend Integration

To connect with a real backend:

1. **Update API Base URL**

   ```javascript
   // src/api/axiosConfig.js
   baseURL: "http://your-backend-url/api/";
   ```

2. **Implement Authentication**

   ```javascript
   // Add JWT token to requests
   config.headers.Authorization = `Bearer ${token}`;
   ```

3. **Create Backend Endpoints**
   - Implement the required REST endpoints
   - Add proper validation and error handling
   - Set up database models for nurse data

## Demo Mode

The system includes a demo mode that uses sample data when the backend is not connected. This allows you to:

- Test all functionality without a backend
- See the UI and user experience
- Understand the expected data structure
- Develop the frontend independently

## Security Considerations

- **Admin Authorization**: Only admin users should access nurse management
- **License Verification**: Implement license number validation
- **Input Validation**: Both client and server-side validation
- **Data Encryption**: Sensitive data should be encrypted
- **Audit Logging**: Track all nurse management operations
- **Role-Based Access**: Different permissions for different admin levels

## Future Enhancements

- **License Verification**: Real-time license verification system
- **Shift Scheduling**: Advanced shift management and scheduling
- **Certification Tracking**: Track nursing certifications and renewals
- **Profile Pictures**: Add image upload functionality
- **Bulk Operations**: Import/export nurse data
- **Advanced Search**: Filter and search capabilities
- **Reports**: Generate nurse reports and analytics
- **Notifications**: Email notifications for nurse changes
- **Document Management**: Upload and manage nurse documents
- **Performance Reviews**: Track nurse performance and evaluations

## Troubleshooting

### Common Issues:

1. **Form Validation Errors**

   - Check all required fields are filled
   - Ensure email format is correct
   - Verify phone number is 10 digits
   - Ensure license number is provided

2. **API Connection Issues**

   - Verify backend server is running
   - Check API endpoint URLs
   - Ensure CORS is properly configured

3. **Component Not Rendering**
   - Check all required props are passed
   - Verify Material-UI dependencies are installed
   - Check console for JavaScript errors

## Support

For issues or questions:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure your backend API is properly configured
4. Review the API documentation for endpoint requirements

---

**Note**: This is a frontend implementation. For production use, ensure you have a proper backend API and database setup.
