package com.buildtrack.repository;

import com.buildtrack.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    long countByAttendanceDateAndStatus(
            LocalDate attendanceDate,
            String status);
}