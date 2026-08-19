package com.lifetrack.backend.controller;

import com.lifetrack.backend.entity.SleepRecord;
import com.lifetrack.backend.service.SleepRecordService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sleep")
@CrossOrigin(origins = "http://localhost:5173")
public class SleepRecordController {

    private final SleepRecordService service;

    public SleepRecordController(SleepRecordService service) {
        this.service = service;
    }

    @GetMapping
    public List<SleepRecord> getAllSleepRecords() {
        return service.getAllSleepRecords();
    }

    @PostMapping
    public SleepRecord createSleepRecord(@RequestBody SleepRecord sleepRecord) {
        return service.createSleepRecord(sleepRecord);
    }

    @DeleteMapping("/{id}")
    public void deleteSleepRecord(@PathVariable Long id) {
        service.deleteSleepRecord(id);
    }
}