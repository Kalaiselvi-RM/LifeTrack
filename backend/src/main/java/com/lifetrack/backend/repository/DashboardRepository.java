package com.lifetrack.backend.repository;

import com.lifetrack.backend.entity.TimerSession;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface DashboardRepository
        extends JpaRepository<TimerSession, Long> {

    @Query("""
        SELECT COALESCE(SUM(t.durationSeconds), 0)
        FROM TimerSession t
        WHERE t.status = 'COMPLETED'
        AND t.startTime >= :start
        AND t.startTime < :end
    """)
    Long getActivityTime(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    @Query("""
        SELECT COALESCE(SUM(t.durationSeconds), 0)
        FROM TimerSession t
        WHERE t.status = 'COMPLETED'
        AND t.activity.classification = 'Focus'
        AND t.startTime >= :start
        AND t.startTime < :end
    """)
    Long getFocusTime(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}