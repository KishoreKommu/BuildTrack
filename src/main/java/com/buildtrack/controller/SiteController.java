package com.buildtrack.controller;

import com.buildtrack.entity.Site;
import com.buildtrack.repository.SiteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sites")
@CrossOrigin("*")
public class SiteController {

    private final SiteRepository repository;

    public SiteController(SiteRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Site addSite(@RequestBody Site site) {
        return repository.save(site);
    }

    @GetMapping
    public List<Site> getAllSites() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Site getSiteById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Site updateSite(@PathVariable Long id,
                           @RequestBody Site site) {

        Site existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setSiteCode(site.getSiteCode());
        existing.setProjectName(site.getProjectName());
        existing.setLocation(site.getLocation());
        existing.setStartDate(site.getStartDate());
        existing.setStatus(site.getStatus());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public String deleteSite(@PathVariable Long id) {

        repository.deleteById(id);

        return "Site Deleted Successfully";
    }
}