package com.hospital.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.entity.Staff;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    Optional<Staff> findByEmail(String email);
    
    Optional<Staff> findByUserId(Long userId);
} 