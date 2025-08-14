package com.hospital.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dto.request.StaffRequest;
import com.hospital.dto.response.StaffResponse;
import com.hospital.exception.EmailAlreadyExistsException;
import com.hospital.security.SecurityUtil;
import com.hospital.service.StaffService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private static final Logger logger = LoggerFactory.getLogger(StaffController.class);

    @Autowired
    private StaffService staffService;

    @Autowired
    private SecurityUtil securityUtil;

    // Admin endpoint for registering staff (for frontend compatibility)
    @PostMapping(path = "/admin/staff")
    public ResponseEntity<?> adminRegisterStaff(@Valid @RequestBody StaffRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (!securityUtil.isAdmin(authentication)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied. Only administrators can register staff.");
            }
            StaffResponse response = staffService.registerStaff(request);
            return ResponseEntity.ok(response);
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already registered.");
        } catch (Exception e) {
            logger.error("Error registering staff: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/fetchAllStaff")
    public ResponseEntity<?> getAllStaff() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (!securityUtil.isAdmin(authentication)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied. Only administrators can access this resource.");
            }

            List<StaffResponse> staffResponses = staffService.fetchAllStaff();
            return ResponseEntity.ok(staffResponses);
        } catch (Exception e) {
            logger.error("Error fetching all staff: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching staff details: " + e.getMessage());
        }
    }

    @GetMapping("/details/{email}")
    public ResponseEntity<?> getStaffDetails(@PathVariable String email) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            if (!securityUtil.isAdmin(authentication) && !userDetails.getUsername().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied. You can only view your own details.");
            }

            StaffResponse staff = staffService.fetchStaffByEmail(email);
            if (staff == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Staff not found with email: " + email);
            }

            return ResponseEntity.ok(staff);
        } catch (Exception e) {
            logger.error("Error fetching staff details: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching staff details");
        }
    }

    @GetMapping("/detailsById/{id}")
    public ResponseEntity<?> getStaffDetailsById(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (!securityUtil.isAdmin(authentication)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied. Only administrators can access this resource.");
            }

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

    @PutMapping("/update/{email}")
    public ResponseEntity<?> updateStaff(@PathVariable String email,
            @Valid @RequestBody StaffResponse updatedStaff) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            if (!securityUtil.isAdmin(authentication) && !userDetails.getUsername().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied. You can only update your own details.");
            }

            StaffResponse updated = staffService.updateStaff(email, updatedStaff);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data provided: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error updating staff: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating staff details");
        }
    }

    @PutMapping("/updateById/{id}")
    public ResponseEntity<?> updateStaffById(@PathVariable Long id,
            @Valid @RequestBody StaffResponse updatedStaff) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (!securityUtil.isAdmin(authentication)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied. Only administrators can access this resource.");
            }

            StaffResponse updated = staffService.updateStaffById(id, updatedStaff);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data provided: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error updating staff: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating staff details");
        }
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<?> deleteStaff(@PathVariable String email) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            if (!securityUtil.isAdmin(authentication) && !userDetails.getUsername().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied. You can only delete your own details.");
            }

            boolean deleted = staffService.deleteStaff(email);

            if (deleted) {
                return ResponseEntity.ok("Staff deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Staff not found with the provided email.");
            }
        } catch (Exception e) {
            logger.error("Error deleting staff: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting staff details.");
        }
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<?> deleteStaffById(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (!securityUtil.isAdmin(authentication)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied. Only administrators can access this resource.");
            }

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
} 