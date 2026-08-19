package com.lifetrack.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sleep_records")
public class SleepRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private java.time.LocalDate date;

    private java.time.LocalTime sleepTime;

    private java.time.LocalTime wakeTime;

    private Integer durationMinutes;

    private String quality;

    public SleepRecord() {
    }

    public Long getId() {
        return id;
    }

    public java.time.LocalDate getDate() {
        return date;
    }

    public void setDate(java.time.LocalDate date) {
        this.date = date;
    }

    public java.time.LocalTime getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(java.time.LocalTime sleepTime) {
        this.sleepTime = sleepTime;
    }

    public java.time.LocalTime getWakeTime() {
        return wakeTime;
    }

    public void setWakeTime(java.time.LocalTime wakeTime) {
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