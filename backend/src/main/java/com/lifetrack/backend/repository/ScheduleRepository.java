package com.lifetrack.backend.repository;

import com.lifetrack.backend.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
}