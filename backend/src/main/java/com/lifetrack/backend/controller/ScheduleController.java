package com.lifetrack.backend.controller;

import com.lifetrack.backend.entity.Schedule;
import com.lifetrack.backend.repository.ScheduleRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")

public class ScheduleController {

    private final ScheduleRepository scheduleRepository;


    public ScheduleController(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }


    // GET all schedules
    @GetMapping
    public List<Schedule> getAllSchedules() {

        return scheduleRepository.findAll();

    }


    // GET schedule by ID
    @GetMapping("/{id}")
    public Schedule getScheduleById(@PathVariable Long id) {

        return scheduleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Schedule not found"));

    }


    // CREATE schedule
    @PostMapping
    public Schedule createSchedule(@RequestBody Schedule schedule) {

        return scheduleRepository.save(schedule);

    }


    // UPDATE schedule
    @PutMapping("/{id}")
    public Schedule updateSchedule(
            @PathVariable Long id,
            @RequestBody Schedule schedule) {

        Schedule existing =
                scheduleRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Schedule not found"));

        existing.setTitle(schedule.getTitle());
        existing.setDescription(schedule.getDescription());
        existing.setDate(schedule.getDate());
        existing.setStartTime(schedule.getStartTime());
        existing.setEndTime(schedule.getEndTime());
        existing.setCategory(schedule.getCategory());
        existing.setStatus(schedule.getStatus());

        return scheduleRepository.save(existing);
    }


    // DELETE schedule
    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id) {

        scheduleRepository.deleteById(id);

    }
}