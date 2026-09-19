package com.buildtrack.controller;

import com.buildtrack.entity.WorkerAssignment;
import com.buildtrack.repository.WorkerAssignmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
@CrossOrigin("*")
public class WorkerAssignmentController {

    private final WorkerAssignmentRepository repository;

    public WorkerAssignmentController(
            WorkerAssignmentRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public WorkerAssignment assignWorker(
            @RequestBody WorkerAssignment assignment) {

        return repository.save(assignment);
    }

    @GetMapping
    public List<WorkerAssignment> getAssignments() {
        return repository.findAll();
    }
}