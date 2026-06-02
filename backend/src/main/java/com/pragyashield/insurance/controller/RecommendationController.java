package com.pragyashield.insurance.controller;

import com.pragyashield.insurance.dto.RecommendationRequest;
import com.pragyashield.insurance.dto.RecommendationResponse;
import com.pragyashield.insurance.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/policy")
    public RecommendationResponse recommendPolicy(@Valid @RequestBody RecommendationRequest request) {
        return recommendationService.recommend(request);
    }
}
