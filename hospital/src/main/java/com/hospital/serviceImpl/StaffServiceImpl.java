package com.hospital.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.dto.request.StaffRequest;
import com.hospital.dto.response.StaffResponse;
import com.hospital.entity.Staff;
import com.hospital.entity.User;
import com.hospital.exception.CustomInternalServerException;
import com.hospital.exception.EmailAlreadyExistsException;
import com.hospital.repository.StaffRepository;
import com.hospital.service.StaffService;
import com.hospital.service.UserService;

@Service
public class StaffServiceImpl implements StaffService {

    @Autowired
    private UserService userService;

    @Autowired
    private StaffRepository staffRepository;

    public StaffResponse registerStaff(StaffRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Registration request cannot be null");
        }

        try {
            // Step 1: Create User (Authentication Details)
            User savedUser = userService.createUser(request.getEmail(), request.getPassword(), "STAFF");

            Staff staff = new Staff();
            BeanUtils.copyProperties(request, staff);

            staff.setUserId(savedUser.getId()); // Link with userId
            staff = staffRepository.save(staff);
            return convertToResponse(staff);

        } catch (EmailAlreadyExistsException ex) {
            // Handle custom exception for email already registered
            throw new EmailAlreadyExistsException(
                    "The provided email is already registered. Please use a different email.");

        } catch (Exception ex) {
            throw new CustomInternalServerException(
                    "An error occurred while registering the staff. Please try again later.");
        }
    }

    public StaffResponse fetchStaffByEmail(String email) {
        Staff staff = staffRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Staff not found"));
        return convertToResponse(staff);
    }

    public StaffResponse fetchStaffById(Long id) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff not found"));
        return convertToResponse(staff);
    }

    public List<StaffResponse> fetchAllStaff() {
        return staffRepository.findAll().stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public StaffResponse updateStaff(String email, StaffResponse request) {
        Staff staff = staffRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Staff not found"));

        // Update fields
        staff.setFirstName(request.getFirstName());
        staff.setLastName(request.getLastName());
        staff.setPhoneNumber(request.getPhoneNumber());
        staff.setRole(request.getRole());
        staff.setDepartment(request.getDepartment());
        staff.setAddress(request.getAddress());
        staff.setCity(request.getCity());
        staff.setState(request.getState());
        staff.setDateOfBirth(request.getDateOfBirth());
        staff.setHireDate(request.getHireDate());
        staff.setSalary(request.getSalary());
        staff.setEmergencyContact(request.getEmergencyContact());
        staff.setEmergencyPhone(request.getEmergencyPhone());
        
        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            staff.setPassword(request.getPassword());
            // Also update the User entity password
            userService.updateUserPassword(email, request.getPassword());
        }

        staff = staffRepository.save(staff);
        return convertToResponse(staff);
    }

    public StaffResponse updateStaffById(Long id, StaffResponse request) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff not found"));

        // Update fields
        staff.setFirstName(request.getFirstName());
        staff.setLastName(request.getLastName());
        staff.setPhoneNumber(request.getPhoneNumber());
        staff.setRole(request.getRole());
        staff.setDepartment(request.getDepartment());
        staff.setAddress(request.getAddress());
        staff.setCity(request.getCity());
        staff.setState(request.getState());
        staff.setDateOfBirth(request.getDateOfBirth());
        staff.setHireDate(request.getHireDate());
        staff.setSalary(request.getSalary());
        staff.setEmergencyContact(request.getEmergencyContact());
        staff.setEmergencyPhone(request.getEmergencyPhone());
        
        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            staff.setPassword(request.getPassword());
            // Also update the User entity password
            userService.updateUserPassword(staff.getEmail(), request.getPassword());
        }

        staff = staffRepository.save(staff);
        return convertToResponse(staff);
    }

    public boolean deleteStaff(String email) {
        Staff staff = staffRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Staff not found"));
        if (staff != null) {
            staffRepository.delete(staff);
            return true;
        }
        return false;
    }

    public boolean deleteStaffById(Long id) {
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff not found"));
        if (staff != null) {
            staffRepository.delete(staff);
            return true;
        }
        return false;
    }

    private StaffResponse convertToResponse(Staff staff) {
        StaffResponse response = new StaffResponse();
        response.setId(staff.getId());
        response.setFirstName(staff.getFirstName());
        response.setLastName(staff.getLastName());
        response.setEmail(staff.getEmail());
        response.setPhoneNumber(staff.getPhoneNumber());
        response.setRole(staff.getRole());
        response.setDepartment(staff.getDepartment());
        response.setAddress(staff.getAddress());
        response.setCity(staff.getCity());
        response.setState(staff.getState());
        response.setDateOfBirth(staff.getDateOfBirth());
        response.setHireDate(staff.getHireDate());
        response.setSalary(staff.getSalary());
        response.setEmergencyContact(staff.getEmergencyContact());
        response.setEmergencyPhone(staff.getEmergencyPhone());
        // Don't include password in response for security
        return response;
    }
} 