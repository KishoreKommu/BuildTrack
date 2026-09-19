package com.buildtrack.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class WorkerAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Worker worker;

    @ManyToOne
    private Site site;

    private LocalDate assignedDate;

    public WorkerAssignment() {
    }

    public Long getId() {
        return id;
    }

    public Worker getWorker() {
        return worker;
    }

    public void setWorker(Worker worker) {
        this.worker = worker;
    }

    public Site getSite() {
        return site;
    }

    public void setSite(Site site) {
        this.site = site;
    }

    public LocalDate getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(LocalDate assignedDate) {
        this.assignedDate = assignedDate;
    }
}