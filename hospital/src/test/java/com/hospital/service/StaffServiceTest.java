package com.hospital.service;

import com.hospital.dto.request.StaffRequest;
import com.hospital.dto.response.StaffResponse;
import com.hospital.serviceImpl.StaffServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class StaffServiceTest {

    @Autowired
    private StaffService staffService;

    @Test
    public void testRegisterStaff() {
        StaffRequest request = new StaffRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john.doe@hospital.com");
        request.setPhoneNumber("9876543210");
        request.setRole("Nurse");
        request.setDepartment("Emergency");
        request.setAddress("123 Main Street");
        request.setCity("Mumbai");
        request.setState("Maharashtra");
        request.setDateOfBirth(LocalDate.of(1990, 5, 15));
        request.setHireDate(LocalDate.of(2020, 3, 1));
        request.setSalary(25000.0);
        request.setEmergencyContact("Jane Doe");
        request.setEmergencyPhone("9876543211");
        request.setPassword("password123");

        StaffResponse response = staffService.registerStaff(request);

        assertNotNull(response);
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertEquals("john.doe@hospital.com", response.getEmail());
        assertEquals("Nurse", response.getRole());
        assertEquals("Emergency", response.getDepartment());
        assertEquals(25000.0, response.getSalary());
    }

    @Test
    public void testFetchAllStaff() {
        List<StaffResponse> staffList = staffService.fetchAllStaff();
        assertNotNull(staffList);
        // The list should not be empty if we have registered staff
        assertFalse(staffList.isEmpty());
    }

    @Test
    public void testFetchStaffByEmail() {
        // First register a staff member
        StaffRequest request = new StaffRequest();
        request.setFirstName("Jane");
        request.setLastName("Smith");
        request.setEmail("jane.smith@hospital.com");
        request.setPhoneNumber("9876543212");
        request.setRole("Receptionist");
        request.setDepartment("Administration");
        request.setAddress("456 Oak Street");
        request.setCity("Mumbai");
        request.setState("Maharashtra");
        request.setDateOfBirth(LocalDate.of(1985, 8, 20));
        request.setHireDate(LocalDate.of(2019, 6, 15));
        request.setSalary(20000.0);
        request.setPassword("password123");

        StaffResponse registeredStaff = staffService.registerStaff(request);

        // Now fetch by email
        StaffResponse fetchedStaff = staffService.fetchStaffByEmail("jane.smith@hospital.com");

        assertNotNull(fetchedStaff);
        assertEquals("Jane", fetchedStaff.getFirstName());
        assertEquals("Smith", fetchedStaff.getLastName());
        assertEquals("Receptionist", fetchedStaff.getRole());
    }

    @Test
    public void testUpdateStaff() {
        // First register a staff member
        StaffRequest request = new StaffRequest();
        request.setFirstName("Mike");
        request.setLastName("Johnson");
        request.setEmail("mike.johnson@hospital.com");
        request.setPhoneNumber("9876543213");
        request.setRole("Lab Technician");
        request.setDepartment("Pathology");
        request.setAddress("789 Pine Street");
        request.setCity("Mumbai");
        request.setState("Maharashtra");
        request.setDateOfBirth(LocalDate.of(1988, 12, 10));
        request.setHireDate(LocalDate.of(2021, 1, 10));
        request.setSalary(30000.0);
        request.setPassword("password123");

        StaffResponse registeredStaff = staffService.registerStaff(request);

        // Create update request
        StaffResponse updateRequest = new StaffResponse();
        updateRequest.setFirstName("Mike");
        updateRequest.setLastName("Johnson");
        updateRequest.setEmail("mike.johnson@hospital.com");
        updateRequest.setPhoneNumber("9876543214"); // Updated phone
        updateRequest.setRole("Senior Lab Technician"); // Updated role
        updateRequest.setDepartment("Pathology");
        updateRequest.setAddress("789 Pine Street");
        updateRequest.setCity("Mumbai");
        updateRequest.setState("Maharashtra");
        updateRequest.setDateOfBirth(LocalDate.of(1988, 12, 10));
        updateRequest.setHireDate(LocalDate.of(2021, 1, 10));
        updateRequest.setSalary(35000.0); // Updated salary
        updateRequest.setEmergencyContact("Sarah Johnson");
        updateRequest.setEmergencyPhone("9876543215");

        StaffResponse updatedStaff = staffService.updateStaff("mike.johnson@hospital.com", updateRequest);

        assertNotNull(updatedStaff);
        assertEquals("9876543214", updatedStaff.getPhoneNumber());
        assertEquals("Senior Lab Technician", updatedStaff.getRole());
        assertEquals(35000.0, updatedStaff.getSalary());
    }
} 