package com.lifetrack.backend.service;

import com.lifetrack.backend.entity.Activity;
import com.lifetrack.backend.entity.TimerSession;
import com.lifetrack.backend.repository.ActivityRepository;
import com.lifetrack.backend.repository.TimerSessionRepository;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TimerSessionService {

    private final TimerSessionRepository timerSessionRepository;
    private final ActivityRepository activityRepository;

    public TimerSessionService(
            TimerSessionRepository timerSessionRepository,
            ActivityRepository activityRepository
    ) {
        this.timerSessionRepository = timerSessionRepository;
        this.activityRepository = activityRepository;
    }


    // =====================================================
    // START TIMER
    // =====================================================

    public TimerSession startSession(Long activityId) {

        Activity activity =
                activityRepository
                        .findById(activityId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Activity not found"
                                )
                        );

        TimerSession session =
                new TimerSession();

        LocalDateTime now =
                LocalDateTime.now();

        session.setActivity(activity);

        session.setStartTime(now);

        session.setLastResumedAt(now);

        session.setDurationSeconds(0L);

        session.setStatus("RUNNING");

        return timerSessionRepository.save(session);
    }


    // =====================================================
    // PAUSE TIMER
    // =====================================================

    public TimerSession pauseSession(Long sessionId) {

        TimerSession session =
                timerSessionRepository
                        .findById(sessionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Timer session not found"
                                )
                        );

        if (!"RUNNING".equals(session.getStatus())) {

            throw new RuntimeException(
                    "Timer is not running"
            );
        }

        LocalDateTime now =
                LocalDateTime.now();

        long currentDuration =
                Duration.between(
                        session.getLastResumedAt(),
                        now
                ).getSeconds();

        long previousDuration =
                session.getDurationSeconds() == null
                        ? 0
                        : session.getDurationSeconds();

        long totalDuration =
                previousDuration +
                currentDuration;

        session.setDurationSeconds(
                totalDuration
        );

        session.setLastResumedAt(null);

        session.setStatus("PAUSED");

        return timerSessionRepository.save(session);
    }


    // =====================================================
    // RESUME TIMER
    // =====================================================

    public TimerSession resumeSession(Long sessionId) {

        TimerSession session =
                timerSessionRepository
                        .findById(sessionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Timer session not found"
                                )
                        );

        if (!"PAUSED".equals(session.getStatus())) {

            throw new RuntimeException(
                    "Timer is not paused"
            );
        }

        session.setLastResumedAt(
                LocalDateTime.now()
        );

        session.setStatus("RUNNING");

        return timerSessionRepository.save(session);
    }


    // =====================================================
    // STOP TIMER
    // =====================================================

    public TimerSession stopSession(Long sessionId) {

        TimerSession session =
                timerSessionRepository
                        .findById(sessionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Timer session not found"
                                )
                        );

        LocalDateTime now =
                LocalDateTime.now();

        long totalDuration =
                session.getDurationSeconds() == null
                        ? 0
                        : session.getDurationSeconds();


        // -------------------------------------------------
        // If timer is currently running,
        // calculate the final active duration.
        // -------------------------------------------------

        if ("RUNNING".equals(session.getStatus())) {

            if (session.getLastResumedAt() != null) {

                long currentDuration =
                        Duration.between(
                                session.getLastResumedAt(),
                                now
                        ).getSeconds();

                totalDuration +=
                        currentDuration;
            }
        }


        // -------------------------------------------------
        // Save final timer information
        // -------------------------------------------------

        session.setDurationSeconds(
                totalDuration
        );

        session.setEndTime(now);

        session.setLastResumedAt(null);

        session.setStatus("COMPLETED");

        return timerSessionRepository.save(session);
    }


    // =====================================================
    // GET TIMER HISTORY
    // GET /api/timer-sessions
    // =====================================================

    public List<TimerSession> getAllSessions() {

        return timerSessionRepository.findAll();
    }


    // =====================================================
    // DELETE TIMER SESSION
    // DELETE /api/timer-sessions/{sessionId}
    // =====================================================

    public void deleteSession(Long sessionId) {

        TimerSession session =
                timerSessionRepository
                        .findById(sessionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Timer session not found"
                                )
                        );

        timerSessionRepository.delete(session);
    }
}