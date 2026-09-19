package com.buildtrack.repository;

import com.buildtrack.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkerRepository extends JpaRepository<Worker, Long> {

    List<Worker> findByNameContaining(String name);

}