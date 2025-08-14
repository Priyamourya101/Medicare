package com.hospital.service;

import com.hospital.entity.User;

public interface UserService {

	public User createUser(String email, String password, String role);
	
	public User updateUserPassword(String email, String newPassword);

}
