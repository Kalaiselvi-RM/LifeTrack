package com.lifetrack.backend.controller;

import com.lifetrack.backend.entity.Goal;
import com.lifetrack.backend.repository.GoalRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")

public class GoalController {

    private final GoalRepository goalRepository;


    public GoalController(
            GoalRepository goalRepository
    ) {
        this.goalRepository = goalRepository;
    }


    // GET ALL GOALS

    @GetMapping
    public List<Goal> getGoals() {

        return goalRepository.findAll();

    }


    // CREATE GOAL

    @PostMapping
    public Goal createGoal(
            @RequestBody Goal goal
    ) {

        return goalRepository.save(goal);

    }


    // DELETE GOAL

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(
            @PathVariable Long id
    ) {

        if (!goalRepository.existsById(id)) {

            return ResponseEntity.notFound().build();

        }

        goalRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}