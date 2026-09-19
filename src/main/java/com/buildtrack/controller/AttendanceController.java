package com.buildtrack.controller;

import com.buildtrack.entity.Attendance;
import com.buildtrack.repository.AttendanceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin("*")
public class AttendanceController {

    private final AttendanceRepository repository;

    public AttendanceController(
            AttendanceRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Attendance markAttendance(
            @RequestBody Attendance attendance) {

        return repository.save(attendance);
    }

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return repository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deleteAttendance(
            @PathVariable Long id) {

        repository.deleteById(id);

        return "Attendance Deleted";
    }
}