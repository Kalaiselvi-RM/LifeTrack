package com.lifetrack.backend.controller;

import com.lifetrack.backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")

public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ) {
        this.dashboardService =
                dashboardService;
    }

    @GetMapping("/today")
    public ResponseEntity<Map<String, Long>>
    getTodayStats() {

        return ResponseEntity.ok(
                dashboardService.getTodayStats()
        );
    }
}
