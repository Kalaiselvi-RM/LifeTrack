package com.lifetrack.backend.service;

import com.lifetrack.backend.repository.DashboardRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public DashboardService(
            DashboardRepository dashboardRepository
    ) {
        this.dashboardRepository = dashboardRepository;
    }

    public Map<String, Long> getTodayStats() {

        LocalDate today = LocalDate.now();

        LocalDateTime start =
                today.atStartOfDay();

        LocalDateTime end =
                today.plusDays(1).atStartOfDay();

        Long activityTime =
                dashboardRepository.getActivityTime(
                        start,
                        end
                );

        Long focusTime =
                dashboardRepository.getFocusTime(
                        start,
                        end
                );

        Map<String, Long> result =
                new HashMap<>();

        result.put(
                "activityTimeSeconds",
                activityTime
        );

        result.put(
                "focusTimeSeconds",
                focusTime
        );

        return result;
    }
}
