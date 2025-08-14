# Staff Management System

A comprehensive staff management system for hospital administration with CRUD operations, form validation, and Material-UI components.

## Features

### ✅ Staff Registration Form
- **Comprehensive Form Fields**: Personal information, employment details, address, and emergency contact
- **Form Validation**: Client-side validation for all required fields
- **Material-UI Components**: Modern, responsive form components
- **Error Handling**: Real-time validation feedback

### ✅ CRUD Operations
- **Create**: Add new staff members with detailed information
- **Read**: View staff list in organized table format
- **Update**: Edit existing staff member information
- **Delete**: Remove staff members with confirmation

### ✅ Admin-Only Access
- **Authorization**: Only administrators can perform CRUD operations
- **Security**: Proper access control for sensitive operations

### ✅ Employee Details Table
- **Organized Display**: Staff information in clean table format
- **Action Buttons**: View, edit, and delete operations
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
│   │   ├── StaffRegistrationForm.jsx    # Staff registration form
│   │   └── StaffManagement.jsx          # Main staff management page
│   └── tables/
│       └── ViewStaffTable.jsx           # Staff table component
├── services/
│   └── staffService.js                  # API service functions
├── pages/
│   ├── StaffProfile.jsx                 # Individual staff profile
│   └── StaffDemo.jsx                    # Demo page
└── api/
    └── axiosConfig.js                   # Axios configuration
```

## Components

### StaffRegistrationForm
A comprehensive form component for adding and editing staff members.

**Features:**
- Personal information (name, email, phone, DOB)
- Employment details (role, department, hire date, salary)
- Address information (address, city, state)
- Emergency contact (optional)
- Form validation with real-time feedback
- Material-UI components for modern UI

**Props:**
- `onStaffAdded`: Callback function when staff is added/updated
- `onCancel`: Callback function for form cancellation
- `editingStaff`: Staff object for editing mode

### StaffManagement
Main management page that combines the registration form with table view.

**Features:**
- Staff list display with action buttons
- Add new staff functionality
- Edit existing staff members
- Delete staff with confirmation
- View detailed staff information
- Loading states and error handling

### ViewStaffTable
Table component for displaying staff information.

**Features:**
- Responsive table design
- Action buttons (view, edit, delete)
- Role-based color coding
- Sortable columns
- Search and filter capabilities

**Props:**
- `staffList`: Array of staff objects
- `onView`: Callback for view action
- `onEdit`: Callback for edit action
- `onDelete`: Callback for delete action
- `showActions`: Boolean to show/hide action buttons

## API Service (staffService.js)

### Functions:
- `getAllStaff()`: Fetch all staff members
- `addStaff(staffData)`: Add new staff member
- `updateStaff(staffId, staffData)`: Update existing staff
- `deleteStaff(staffId)`: Delete staff member
- `getStaffById(staffId)`: Get specific staff member

### API Endpoints:
- `GET /api/admin/staff` - Get all staff
- `POST /api/admin/staff` - Add new staff
- `PUT /api/admin/staff/{id}` - Update staff
- `DELETE /api/admin/staff/{id}` - Delete staff
- `GET /api/admin/staff/{id}` - Get staff by ID

## Form Validation

### Required Fields:
- First Name
- Last Name
- Email (with format validation)
- Phone Number (10 digits)
- Role
- Department
- Address
- City
- State
- Date of Birth
- Hire Date
- Salary (positive number)

### Validation Rules:
- Email must be in valid format
- Phone number must be 10 digits
- Date of birth cannot be in the future
- Hire date cannot be in the future
- Date of birth cannot be after hire date
- Salary must be a positive number

## Sample Data Structure

```javascript
{
  id: 1,
  fullName: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "9876543210",
  role: "Ward Boy",
  department: "General",
  address: "123 Main Street, Mumbai",
  city: "Mumbai",
  state: "Maharashtra",
  dateOfBirth: "1990-05-15",
  hireDate: "2020-03-01",
  salary: 25000,
  emergencyContact: "Priya Sharma",
  emergencyPhone: "9876543211"
}
```

## Available Roles

- Nurse
- Ward Boy
- Lab Technician
- Receptionist
- Pharmacist
- Security Guard
- Housekeeping
- IT Support
- Maintenance
- Other

## Available Departments

- Emergency
- Cardiology
- Orthopedics
- Pediatrics
- General Medicine
- Surgery
- Pathology
- Radiology
- Pharmacy
- Administration
- IT
- Maintenance
- Security
- Housekeeping

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
   - Navigate to `/staff-demo` to see the staff management system
   - Or integrate components into your existing admin dashboard

## Backend Integration

To connect with a real backend:

1. **Update API Base URL**
   ```javascript
   // src/api/axiosConfig.js
   baseURL: "http://your-backend-url/api/"
   ```

2. **Implement Authentication**
   ```javascript
   // Add JWT token to requests
   config.headers.Authorization = `Bearer ${token}`;
   ```

3. **Create Backend Endpoints**
   - Implement the required REST endpoints
   - Add proper validation and error handling
   - Set up database models for staff data

## Demo Mode

The system includes a demo mode that uses sample data when the backend is not connected. This allows you to:

- Test all functionality without a backend
- See the UI and user experience
- Understand the expected data structure
- Develop the frontend independently

## Security Considerations

- **Admin Authorization**: Only admin users should access staff management
- **Input Validation**: Both client and server-side validation
- **Data Encryption**: Sensitive data should be encrypted
- **Audit Logging**: Track all staff management operations
- **Role-Based Access**: Different permissions for different admin levels

## Future Enhancements

- **Profile Pictures**: Add image upload functionality
- **Bulk Operations**: Import/export staff data
- **Advanced Search**: Filter and search capabilities
- **Reports**: Generate staff reports and analytics
- **Notifications**: Email notifications for staff changes
- **Document Management**: Upload and manage staff documents

## Troubleshooting

### Common Issues:

1. **Form Validation Errors**
   - Check all required fields are filled
   - Ensure email format is correct
   - Verify phone number is 10 digits

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