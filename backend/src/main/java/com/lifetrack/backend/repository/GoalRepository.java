package com.lifetrack.backend.repository;

import com.lifetrack.backend.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalRepository
        extends JpaRepository<Goal, Long> {
}