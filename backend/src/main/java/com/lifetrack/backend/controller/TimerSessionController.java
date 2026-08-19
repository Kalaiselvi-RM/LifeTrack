package com.lifetrack.backend.controller;

import com.lifetrack.backend.entity.TimerSession;
import com.lifetrack.backend.service.TimerSessionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/timer-sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class TimerSessionController {

    private final TimerSessionService timerSessionService;

    public TimerSessionController(
            TimerSessionService timerSessionService
    ) {
        this.timerSessionService = timerSessionService;
    }


    // =====================================================
    // START TIMER
    // POST /api/timer-sessions/start/{activityId}
    // =====================================================

    @PostMapping("/start/{activityId}")
    public ResponseEntity<TimerSession> startSession(
            @PathVariable Long activityId
    ) {

        TimerSession session =
                timerSessionService.startSession(activityId);

        return ResponseEntity.ok(session);
    }


    // =====================================================
    // PAUSE TIMER
    // POST /api/timer-sessions/{sessionId}/pause
    // =====================================================

    @PostMapping("/{sessionId}/pause")
    public ResponseEntity<TimerSession> pauseSession(
            @PathVariable Long sessionId
    ) {

        TimerSession session =
                timerSessionService.pauseSession(sessionId);

        return ResponseEntity.ok(session);
    }


    // =====================================================
    // RESUME TIMER
    // POST /api/timer-sessions/{sessionId}/resume
    // =====================================================

    @PostMapping("/{sessionId}/resume")
    public ResponseEntity<TimerSession> resumeSession(
            @PathVariable Long sessionId
    ) {

        TimerSession session =
                timerSessionService.resumeSession(sessionId);

        return ResponseEntity.ok(session);
    }


    // =====================================================
    // STOP TIMER
    // POST /api/timer-sessions/{sessionId}/stop
    // =====================================================

    @PostMapping("/{sessionId}/stop")
    public ResponseEntity<TimerSession> stopSession(
            @PathVariable Long sessionId
    ) {

        TimerSession session =
                timerSessionService.stopSession(sessionId);

        return ResponseEntity.ok(session);
    }


    // =====================================================
    // TIMER HISTORY
    // GET /api/timer-sessions
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getAllSessions() {

        return ResponseEntity.ok(
                timerSessionService.getAllSessions()
        );
    }


    // =====================================================
    // DELETE TIMER SESSION
    // DELETE /api/timer-sessions/{sessionId}
    // =====================================================

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable Long sessionId
    ) {

        timerSessionService.deleteSession(sessionId);

        return ResponseEntity.noContent().build();
    }
}