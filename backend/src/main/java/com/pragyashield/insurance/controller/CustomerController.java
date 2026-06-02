package com.pragyashield.insurance.controller;

import com.pragyashield.insurance.domain.CustomerProfile;
import com.pragyashield.insurance.service.CustomerService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<CustomerProfile> customers() {
        return customerService.findAll();
    }

    @GetMapping("/{customerId}")
    public CustomerProfile customer(@PathVariable String customerId) {
        return customerService.findById(customerId);
    }
}
