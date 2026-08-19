package com.lifetrack.backend.controller;

import com.lifetrack.backend.entity.Activity;
import com.lifetrack.backend.service.ActivityService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(
            @RequestBody Activity activity) {

        Activity savedActivity =
                activityService.createActivity(activity);

        return ResponseEntity.ok(savedActivity);
    }

    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities() {

        return ResponseEntity.ok(
                activityService.getAllActivities()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(
            @PathVariable Long id) {

        activityService.deleteActivity(id);

        return ResponseEntity.noContent().build();
    }
}