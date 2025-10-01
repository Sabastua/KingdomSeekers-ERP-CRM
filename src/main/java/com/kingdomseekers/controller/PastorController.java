package com.kingdomseekers.controller;

import com.kingdomseekers.entity.Pastor;
import com.kingdomseekers.service.PastorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/pastors")
public class PastorController {

    private final PastorService pastorService;

    @Autowired
    public PastorController(PastorService pastorService) {
        this.pastorService = pastorService;
    }

    @GetMapping
    public ResponseEntity<List<Pastor>> getAllPastors() {
        return ResponseEntity.ok(pastorService.getAllPastors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pastor> getPastorById(@PathVariable Long id) {
        return pastorService.getPastorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Pastor> createPastor(@Valid @RequestBody Pastor pastor) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pastorService.createPastor(pastor));
    }

    @GetMapping("/branch/{churchBranch}")
    public ResponseEntity<List<Pastor>> getPastorsByChurchBranch(@PathVariable String churchBranch) {
        return ResponseEntity.ok(pastorService.getPastorsByChurchBranch(churchBranch));
    }

    @GetMapping("/country/{countryCode}")
    public ResponseEntity<List<Pastor>> getPastorsByCountry(@PathVariable String countryCode) {
        return ResponseEntity.ok(pastorService.getPastorsByCountry(countryCode));
    }
}