package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.model.UserRole;

public record LoginResponse(String token, String fullName, String email, UserRole role, String message) {}
