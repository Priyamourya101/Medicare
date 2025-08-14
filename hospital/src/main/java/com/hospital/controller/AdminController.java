package com.hospital.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dto.request.StaffRequest;
import com.hospital.dto.response.AdminResponse;
import com.hospital.dto.response.StaffResponse;
import com.hospital.dto.response.OrderResponse;
import com.hospital.exception.EmailAlreadyExistsException;
import com.hospital.security.JwtTokenUtil;
import com.hospital.service.AdminService;
import com.hospital.service.StaffService;
import com.hospital.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
	
	

	@Autowired
	private AdminService adminService;

	@Autowired
	private StaffService staffService;

	@Autowired
	private OrderService orderService;

	@Autowired
	private JwtTokenUtil jwtUtil;

	private String extractEmailFromToken(String token) {
		if (token.startsWith("Bearer ")) {
			token = token.substring(7); // Remove "Bearer " prefix
		}
		return jwtUtil.extractUsername(token);
	}

	@GetMapping("/dashboard")
	public String getAdminDashboard() {
		return "Welcome to the Admin Dashboard";
	}

	@GetMapping("/details")
	public ResponseEntity<AdminResponse> getAdminDetails(@RequestHeader("Authorization") String token) {
		logger.debug("Received request to get patient details");

		logger.debug("Authorization token: {}", token);

		String email = extractEmailFromToken(token);
		logger.debug("Extracted email from token: {}", email);

		AdminResponse admin = adminService.getAdminData(email);

		if (admin != null) {
			logger.debug("Patient details found: {}", admin);
			return ResponseEntity.ok(admin);
		} else {
			logger.warn("No patient found for email: {}", email);
			return ResponseEntity.notFound().build();
		}
	}

	// Staff Management Endpoints for Admin
	@GetMapping("/staff")
	public ResponseEntity<?> getAllStaff() {
		try {
			List<StaffResponse> staffResponses = staffService.fetchAllStaff();
			return ResponseEntity.ok(staffResponses);
		} catch (Exception e) {
			logger.error("Error fetching all staff: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while fetching staff details: " + e.getMessage());
		}
	}

	@PostMapping("/staff")
	public ResponseEntity<?> addStaff(@Valid @RequestBody StaffRequest request) {
		try {
			StaffResponse response = staffService.registerStaff(request);
			return ResponseEntity.ok(response);
		} catch (EmailAlreadyExistsException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already registered.");
		} catch (Exception e) {
			logger.error("Error registering staff: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An unexpected error occurred: " + e.getMessage());
		}
	}

	@PutMapping("/staff/{id}")
	public ResponseEntity<?> updateStaff(@PathVariable Long id, @Valid @RequestBody StaffRequest request) {
		try {
			// Convert StaffRequest to StaffResponse for update
			StaffResponse staffResponse = new StaffResponse();
			staffResponse.setFirstName(request.getFirstName());
			staffResponse.setLastName(request.getLastName());
			staffResponse.setEmail(request.getEmail());
			staffResponse.setPhoneNumber(request.getPhoneNumber());
			staffResponse.setRole(request.getRole());
			staffResponse.setDepartment(request.getDepartment());
			staffResponse.setAddress(request.getAddress());
			staffResponse.setCity(request.getCity());
			staffResponse.setState(request.getState());
			staffResponse.setDateOfBirth(request.getDateOfBirth());
			staffResponse.setHireDate(request.getHireDate());
			staffResponse.setSalary(request.getSalary());
			staffResponse.setEmergencyContact(request.getEmergencyContact());
			staffResponse.setEmergencyPhone(request.getEmergencyPhone());
			staffResponse.setPassword(request.getPassword()); // Include password for update

			StaffResponse updated = staffService.updateStaffById(id, staffResponse);
			return ResponseEntity.ok(updated);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data provided: " + e.getMessage());
		} catch (Exception e) {
			logger.error("Error updating staff: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while updating staff details");
		}
	}

	@DeleteMapping("/staff/{id}")
	public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
		try {
			boolean deleted = staffService.deleteStaffById(id);

			if (deleted) {
				return ResponseEntity.ok("Staff deleted successfully.");
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Staff not found with the provided ID.");
			}
		} catch (Exception e) {
			logger.error("Error deleting staff: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while deleting staff details.");
		}
	}

	@GetMapping("/staff/{id}")
	public ResponseEntity<?> getStaffById(@PathVariable Long id) {
		try {
			StaffResponse staff = staffService.fetchStaffById(id);
			if (staff == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Staff not found with ID: " + id);
			}
			return ResponseEntity.ok(staff);
		} catch (Exception e) {
			logger.error("Error fetching staff details: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while fetching staff details");
		}
	}

	// Admin endpoint to get all orders
	@GetMapping("/orders")
	public ResponseEntity<?> getAllOrders() {
		try {
			List<OrderResponse> orders = orderService.getAllOrdersAsResponse();
			return ResponseEntity.ok(orders);
		} catch (Exception e) {
			logger.error("Error fetching all orders: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while fetching orders: " + e.getMessage());
		}
	}
}
