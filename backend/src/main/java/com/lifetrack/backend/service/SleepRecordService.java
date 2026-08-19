package com.lifetrack.backend.service;

import com.lifetrack.backend.entity.SleepRecord;
import com.lifetrack.backend.repository.SleepRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SleepRecordService {

    private final SleepRecordRepository repository;

    public SleepRecordService(SleepRecordRepository repository) {
        this.repository = repository;
    }

    public List<SleepRecord> getAllSleepRecords() {
        return repository.findAllByOrderByDateDesc();
    }

    public SleepRecord createSleepRecord(SleepRecord sleepRecord) {
        return repository.save(sleepRecord);
    }

    public void deleteSleepRecord(Long id) {
        repository.deleteById(id);
    }
}