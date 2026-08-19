package com.lifetrack.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lifetrack.backend.entity.TimerSession;



@Repository
public interface AnalyticsRepository extends JpaRepository<TimerSession, Long> {

    @Query(value = """
        SELECT
            COALESCE(SUM(CASE
                WHEN status = 'COMPLETED'
                THEN duration_seconds
                ELSE 0
            END), 0)
        FROM timer_sessions
        """, nativeQuery = true)
    Long getTotalActivityTime();

    @Query(value = """
        SELECT
            COALESCE(SUM(CASE
                WHEN ts.status = 'COMPLETED'
                AND a.classification = 'Focus'
                THEN ts.duration_seconds
                ELSE 0
            END), 0)
        FROM timer_sessions ts
        JOIN activities a ON ts.activity_id = a.id
        """, nativeQuery = true)
    Long getTotalFocusTime();

    @Query(value = """
        SELECT COUNT(*)
        FROM timer_sessions
        WHERE status = 'COMPLETED'
        """, nativeQuery = true)
    Long getCompletedSessions();

    @Query(value = """
        SELECT COUNT(*)
        FROM goals
        WHERE status = 'COMPLETED'
        """, nativeQuery = true)
    Long getCompletedGoals();

    @Query(value = """
        SELECT COUNT(*)
        FROM schedules
        WHERE status = 'PLANNED'
        """, nativeQuery = true)
    Long getPlannedSchedules();

    @Query(value = """
        SELECT COALESCE(SUM(duration_minutes), 0)
        FROM sleep_records
        """, nativeQuery = true)
    Long getTotalSleepMinutes();

    @Query(value = """
        SELECT COALESCE(AVG(duration_minutes), 0)
        FROM sleep_records
        """, nativeQuery = true)
    Double getAverageSleepMinutes();
}
