package com.lifetrack.backend.service;

import com.lifetrack.backend.entity.SleepRecord;
import com.lifetrack.backend.repository.SleepRecordRepository;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class SleepRecordService {

    private final SleepRecordRepository repository;

    public SleepRecordService(SleepRecordRepository repository) {
        this.repository = repository;
    }

    // =====================================================
    // GET ALL SLEEP RECORDS
    // =====================================================

    public List<SleepRecord> getAllSleepRecords() {

        return repository.findAllByOrderByDateDesc();
    }


    // =====================================================
    // CREATE SLEEP RECORD
    // =====================================================

    public SleepRecord createSleepRecord(
            SleepRecord sleepRecord
    ) {

        LocalDate date = sleepRecord.getDate();
        LocalTime sleepTime = sleepRecord.getSleepTime();
        LocalTime wakeTime = sleepRecord.getWakeTime();

        // Validate required fields
        if (date == null) {
            throw new RuntimeException(
                    "Sleep date is required"
            );
        }

        if (sleepTime == null) {
            throw new RuntimeException(
                    "Sleep time is required"
            );
        }

        if (wakeTime == null) {
            throw new RuntimeException(
                    "Wake time is required"
            );
        }

        // =================================================
        // CALCULATE SLEEP DURATION
        // =================================================

        LocalDateTime sleepDateTime =
                LocalDateTime.of(
                        date,
                        sleepTime
                );

        LocalDateTime wakeDateTime =
                LocalDateTime.of(
                        date,
                        wakeTime
                );

        // If wake time is earlier than sleep time,
        // the user woke up on the next day.
        if (wakeTime.isBefore(sleepTime)) {

            wakeDateTime =
                    wakeDateTime.plusDays(1);
        }

        long durationMinutes =
                Duration.between(
                        sleepDateTime,
                        wakeDateTime
                ).toMinutes();

        // =================================================
        // VALIDATE DURATION
        // =================================================

        if (durationMinutes <= 0) {
            throw new RuntimeException(
                    "Sleep duration must be greater than zero"
            );
        }

        // Prevent unrealistic sleep records
        if (durationMinutes > 24 * 60) {
            throw new RuntimeException(
                    "Sleep duration cannot exceed 24 hours"
            );
        }

        // Store calculated duration
        sleepRecord.setDurationMinutes(
                (int) durationMinutes
        );

        // Save record
        return repository.save(sleepRecord);
    }


    // =====================================================
    // DELETE SLEEP RECORD
    // =====================================================

    public void deleteSleepRecord(Long id) {

        if (!repository.existsById(id)) {

            throw new RuntimeException(
                    "Sleep record not found"
            );
        }

        repository.deleteById(id);
    }
}