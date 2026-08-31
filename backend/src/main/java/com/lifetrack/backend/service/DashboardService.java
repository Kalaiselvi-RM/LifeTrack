package com.lifetrack.backend.service;

import com.lifetrack.backend.repository.DashboardRepository;
import com.lifetrack.backend.repository.SleepRecordRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;
    private final SleepRecordRepository sleepRecordRepository;

    public DashboardService(
            DashboardRepository dashboardRepository,
            SleepRecordRepository sleepRecordRepository
    ) {
        this.dashboardRepository = dashboardRepository;
        this.sleepRecordRepository = sleepRecordRepository;
    }


    // =====================================================
    // TODAY'S DASHBOARD
    // =====================================================

    public Map<String, Long> getTodayStats() {

        LocalDate today = LocalDate.now();

        LocalDateTime start =
                today.atStartOfDay();

        LocalDateTime end =
                today.plusDays(1).atStartOfDay();


        // =================================================
        // ACTIVITY TIME
        // =================================================

        Long activityTime =
                dashboardRepository.getActivityTime(
                        start,
                        end
                );

        if (activityTime == null) {
            activityTime = 0L;
        }


        // =================================================
        // FOCUSED TIME
        // =================================================

        Long focusTime =
                dashboardRepository.getFocusTime(
                        start,
                        end
                );

        if (focusTime == null) {
            focusTime = 0L;
        }


        // =================================================
        // SLEEP TIME
        // =================================================

        List<com.lifetrack.backend.entity.SleepRecord> sleepRecords =
                sleepRecordRepository.findByDate(today);

        Long sleepTimeSeconds = 0L;

        for (com.lifetrack.backend.entity.SleepRecord sleepRecord
                : sleepRecords) {

            if (sleepRecord.getDurationMinutes() != null) {

                sleepTimeSeconds +=
                        sleepRecord.getDurationMinutes() * 60L;
            }
        }


        // =================================================
        // RESULT
        // =================================================

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

        result.put(
                "sleepTimeSeconds",
                sleepTimeSeconds
        );


        return result;
    }
}