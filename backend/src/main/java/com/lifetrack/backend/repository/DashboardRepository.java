package com.lifetrack.backend.repository;

import com.lifetrack.backend.entity.TimerSession;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface DashboardRepository
        extends Repository<TimerSession, Long> {

    // =====================================================
    // ACTIVITY TIME
    // =====================================================

    @Query("""
        SELECT COALESCE(SUM(t.durationSeconds), 0)
        FROM TimerSession t
        WHERE t.startTime >= :start
        AND t.startTime < :end
        """)
    Long getActivityTime(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    // =====================================================
    // FOCUS TIME
    // =====================================================

    @Query("""
        SELECT COALESCE(
            SUM(
                t.durationSeconds -
                COALESCE(t.wastedSeconds, 0)
            ),
            0
        )
        FROM TimerSession t
        WHERE t.startTime >= :start
        AND t.startTime < :end
        """)
    Long getFocusTime(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    // =====================================================
    // SLEEP TIME
    // =====================================================

    @Query("""
        SELECT COALESCE(SUM(s.durationMinutes), 0)
        FROM SleepRecord s
        WHERE s.date = :date
        """)
    Long getSleepTime(
            @Param("date") LocalDate date
    );
}