package com.lifetrack.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "sleep_records")
public class SleepRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Date associated with this sleep record
    @Column(nullable = false)
    private LocalDate date;

    // Time when the user went to sleep
    @Column(nullable = false)
    private LocalTime sleepTime;

    // Time when the user woke up
    @Column(nullable = false)
    private LocalTime wakeTime;

    // Calculated sleep duration in minutes
    @Column(nullable = false)
    private Integer durationMinutes;

    // Example: Good, Average, Poor
    private String quality;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public SleepRecord() {
    }

    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(LocalTime sleepTime) {
        this.sleepTime = sleepTime;
    }

    public LocalTime getWakeTime() {
        return wakeTime;
    }

    public void setWakeTime(LocalTime wakeTime) {
        this.wakeTime = wakeTime;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }
}