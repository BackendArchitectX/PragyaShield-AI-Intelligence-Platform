package com.pragyashield.insurance.service;

import com.pragyashield.insurance.domain.CustomerProfile;
import com.pragyashield.insurance.exception.ResourceNotFoundException;
import com.pragyashield.insurance.repository.InMemoryCustomerRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    private final InMemoryCustomerRepository customerRepository;

    public CustomerService(InMemoryCustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<CustomerProfile> findAll() {
        return customerRepository.findAll();
    }

    public CustomerProfile findById(String customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));
    }
}
