package com.pragyashield.insurance.service;

import com.pragyashield.insurance.dto.LoginRequest;
import com.pragyashield.insurance.dto.LoginResponse;
import com.pragyashield.insurance.model.UserRole;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final Map<String, String> passwords = Map.of(
            "CUSTOMER:rajesh@email.com", "customer123",
            "AGENT:agent@email.com", "agent123",
            "ADMIN:admin@email.com", "admin123"
    );

    public LoginResponse login(LoginRequest request) {
        String key = request.role() + ":" + request.email();
        if (!passwords.containsKey(key) || !passwords.get(key).equals(request.password())) {
            throw new IllegalArgumentException("Invalid credentials for selected role");
        }
        String name = switch (request.role()) {
            case CUSTOMER -> "Rajesh Kumar Sharma";
            case AGENT -> "Suresh Nair";
            case ADMIN -> "Admin PragyaShield";
        };
        String token = "demo-" + request.role().name().toLowerCase() + "-token";
        return new LoginResponse(token, name, request.email(), request.role(), "Login successful");
    }
}
