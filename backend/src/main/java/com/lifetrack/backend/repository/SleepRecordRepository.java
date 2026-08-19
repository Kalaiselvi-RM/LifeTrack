package com.lifetrack.backend.repository;

import com.lifetrack.backend.entity.SleepRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SleepRecordRepository extends JpaRepository<SleepRecord, Long> {

    List<SleepRecord> findAllByOrderByDateDesc();

    List<SleepRecord> findByDate(LocalDate date);
}