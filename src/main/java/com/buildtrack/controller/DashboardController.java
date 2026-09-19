package com.buildtrack.controller;

import com.buildtrack.repository.AttendanceRepository;
import com.buildtrack.repository.SiteRepository;
import com.buildtrack.repository.WorkerAssignmentRepository;
import com.buildtrack.repository.WorkerRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin("*")
public class DashboardController {

    private final WorkerRepository workerRepository;
    private final SiteRepository siteRepository;
    private final WorkerAssignmentRepository assignmentRepository;
    private final AttendanceRepository attendanceRepository;

    public DashboardController(
            WorkerRepository workerRepository,
            SiteRepository siteRepository,
            WorkerAssignmentRepository assignmentRepository,
            AttendanceRepository attendanceRepository) {

        this.workerRepository = workerRepository;
        this.siteRepository = siteRepository;
        this.assignmentRepository = assignmentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping
    public Map<String, Object> getDashboard() {

        Map<String, Object> data = new HashMap<>();

        data.put(
                "totalWorkers",
                workerRepository.count()
        );

        data.put(
                "totalSites",
                siteRepository.count()
        );

        data.put(
                "totalAssignments",
                assignmentRepository.count()
        );

        data.put(
                "presentToday",
                attendanceRepository
                        .countByAttendanceDateAndStatus(
                                LocalDate.now(),
                                "PRESENT"
                        )
        );

        return data;
    }
}