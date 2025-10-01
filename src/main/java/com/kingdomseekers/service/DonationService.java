package com.kingdomseekers.service;

import com.kingdomseekers.entity.Donation;
import com.kingdomseekers.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class DonationService {

    private final DonationRepository donationRepository;

    @Autowired
    public DonationService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public Optional<Donation> getDonationById(Long id) {
        return donationRepository.findById(id);
    }

    @Transactional
    public Donation createDonation(Donation donation) {
        donation.setDonationDate(Instant.now());
        return donationRepository.save(donation);
    }

    public List<Donation> getDonationsByMember(Long memberId) {
        return donationRepository.findByMemberId(memberId);
    }

    public List<Donation> getDonationsByType(Donation.DonationType type) {
        return donationRepository.findByType(type);
    }

    public List<Donation> getDonationsByCampaign(String campaignCode) {
        return donationRepository.findByCampaignCode(campaignCode);
    }

    public List<Donation> getDonationsByDateRange(Instant startDate, Instant endDate) {
        return donationRepository.findByDonationDateBetween(startDate, endDate);
    }
}