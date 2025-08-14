package com.hospital.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StaffResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String role;
    private String department;
    private String address;
    private String city;
    private String state;
    private LocalDate dateOfBirth;
    private LocalDate hireDate;
    private Double salary;
    private String emergencyContact;
    private String emergencyPhone;
    private String password; // Added password field for updates
} 