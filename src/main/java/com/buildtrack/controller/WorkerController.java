package com.buildtrack.controller;

import com.buildtrack.entity.Worker;
import com.buildtrack.repository.WorkerRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workers")
@CrossOrigin("*")
public class WorkerController {

    private final WorkerRepository repository;

    public WorkerController(WorkerRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Worker addWorker(@RequestBody Worker worker) {
        return repository.save(worker);
    }

    @GetMapping
    public List<Worker> getAllWorkers() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Worker getWorkerById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Worker updateWorker(
            @PathVariable Long id,
            @RequestBody Worker worker) {

        Worker existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setWorkerCode(worker.getWorkerCode());
        existing.setName(worker.getName());
        existing.setPhone(worker.getPhone());
        existing.setRole(worker.getRole());
        existing.setDailyWage(worker.getDailyWage());
        existing.setExperience(worker.getExperience());
        existing.setStatus(worker.getStatus());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public String deleteWorker(@PathVariable Long id) {

        repository.deleteById(id);

        return "Worker Deleted Successfully";
    }

    @GetMapping("/search")
    public List<Worker> searchWorker(
            @RequestParam String name) {

        return repository.findByNameContaining(name);
    }
}