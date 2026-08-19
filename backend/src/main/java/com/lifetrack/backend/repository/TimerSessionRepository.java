package com.lifetrack.backend.repository;

import com.lifetrack.backend.entity.TimerSession;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimerSessionRepository
        extends JpaRepository<TimerSession, Long> {
}