package com.lifetrack.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "timer_sessions")
public class TimerSession {

    // =====================================================
    // ID
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // ACTIVITY
    // =====================================================

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;


    // =====================================================
    // TIMER INFORMATION
    // =====================================================

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    /*
     * Original timer duration.
     *
     * Example:
     * Timer ran for 5 hours 30 minutes
     *
     * durationSeconds = 19800
     */
    private Long durationSeconds;


    /*
     * Time manually marked as wasted by the user.
     *
     * Example:
     * User wasted 30 minutes using mobile.
     *
     * wastedSeconds = 1800
     */
    private Long wastedSeconds;


    /*
     * Used when the timer is paused/resumed.
     */
    private LocalDateTime lastResumedAt;


    // =====================================================
    // STATUS
    // =====================================================

    @Column(nullable = false)
    private String status;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public TimerSession() {
    }


    // =====================================================
    // ID GETTER
    // =====================================================

    public Long getId() {
        return id;
    }


    // =====================================================
    // ACTIVITY GETTER / SETTER
    // =====================================================

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }


    // =====================================================
    // START TIME
    // =====================================================

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }


    // =====================================================
    // END TIME
    // =====================================================

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }


    // =====================================================
    // DURATION
    // =====================================================

    public Long getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Long durationSeconds) {
        this.durationSeconds = durationSeconds;
    }


    // =====================================================
    // WASTED TIME
    // =====================================================

    public Long getWastedSeconds() {
        return wastedSeconds;
    }

    public void setWastedSeconds(Long wastedSeconds) {
        this.wastedSeconds = wastedSeconds;
    }


    // =====================================================
    // LAST RESUMED TIME
    // =====================================================

    public LocalDateTime getLastResumedAt() {
        return lastResumedAt;
    }

    public void setLastResumedAt(
            LocalDateTime lastResumedAt
    ) {
        this.lastResumedAt = lastResumedAt;
    }


    // =====================================================
    // STATUS
    // =====================================================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    // =====================================================
    // ACTUAL STUDY TIME
    // =====================================================

    /*
     * Actual Study Time =
     *
     * Original Timer Time - Wasted Time
     *
     * Example:
     *
     * durationSeconds = 19800 (5h 30m)
     * wastedSeconds   = 1800  (30m)
     *
     * actual = 18000 (5h)
     */
    @Transient
    public Long getActualStudySeconds() {

        long duration =
                durationSeconds == null
                        ? 0
                        : durationSeconds;

        long wasted =
                wastedSeconds == null
                        ? 0
                        : wastedSeconds;

        long actual =
                duration - wasted;

        // Never allow negative study time.
        return Math.max(actual, 0);
    }
}