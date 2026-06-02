package com.pragyashield.insurance.dto;

import com.pragyashield.insurance.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(@Email String email, @NotBlank String password, @NotNull UserRole role) {}
