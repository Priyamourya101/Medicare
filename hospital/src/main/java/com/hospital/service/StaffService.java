package com.hospital.service;

import java.util.List;

import com.hospital.dto.request.StaffRequest;
import com.hospital.dto.response.StaffResponse;

public interface StaffService {

    public StaffResponse registerStaff(StaffRequest request);

    public StaffResponse fetchStaffByEmail(String email);

    public StaffResponse fetchStaffById(Long id);

    public List<StaffResponse> fetchAllStaff();

    public StaffResponse updateStaff(String email, StaffResponse request);

    public boolean deleteStaff(String email);

    public StaffResponse updateStaffById(Long id, StaffResponse request);

    public boolean deleteStaffById(Long id);
} 