package com.lifetrack.backend.service;

import com.lifetrack.backend.repository.AnalyticsRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    public Map<String, Object> getAnalytics() {

        Map<String, Object> result = new HashMap<>();

        result.put(
            "totalActivityTimeSeconds",
            analyticsRepository.getTotalActivityTime()
        );

        result.put(
            "totalFocusTimeSeconds",
            analyticsRepository.getTotalFocusTime()
        );

        result.put(
            "completedSessions",
            analyticsRepository.getCompletedSessions()
        );

        result.put(
            "completedGoals",
            analyticsRepository.getCompletedGoals()
        );

        result.put(
            "plannedSchedules",
            analyticsRepository.getPlannedSchedules()
        );

        result.put(
            "totalSleepMinutes",
            analyticsRepository.getTotalSleepMinutes()
        );

        result.put(
            "averageSleepMinutes",
            analyticsRepository.getAverageSleepMinutes()
        );

        return result;
    }
}
