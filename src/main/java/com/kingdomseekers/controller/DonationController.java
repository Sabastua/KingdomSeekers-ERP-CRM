package com.kingdomseekers.controller;

import com.kingdomseekers.entity.Donation;
import com.kingdomseekers.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    @Autowired
    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping
    public ResponseEntity<List<Donation>> getAllDonations() {
        return ResponseEntity.ok(donationService.getAllDonations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(@PathVariable Long id) {
        return donationService.getDonationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Donation> createDonation(@Valid @RequestBody Donation donation) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(donationService.createDonation(donation));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Donation>> getDonationsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(donationService.getDonationsByMember(memberId));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Donation>> getDonationsByType(
            @PathVariable Donation.DonationType type) {
        return ResponseEntity.ok(donationService.getDonationsByType(type));
    }

    @GetMapping("/campaign/{campaignCode}")
    public ResponseEntity<List<Donation>> getDonationsByCampaign(
            @PathVariable String campaignCode) {
        return ResponseEntity.ok(donationService.getDonationsByCampaign(campaignCode));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Donation>> getDonationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Instant startInstant = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endInstant = endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        return ResponseEntity.ok(donationService.getDonationsByDateRange(startInstant, endInstant));
    }
}