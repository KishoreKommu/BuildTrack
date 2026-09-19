package com.buildtrack.repository;

import com.buildtrack.entity.WorkerAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkerAssignmentRepository
        extends JpaRepository<WorkerAssignment, Long> {
}