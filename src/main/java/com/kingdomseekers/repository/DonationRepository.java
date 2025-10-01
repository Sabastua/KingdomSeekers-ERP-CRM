package com.kingdomseekers.repository;

import com.kingdomseekers.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByMemberId(Long memberId);
    List<Donation> findByType(Donation.DonationType type);
    List<Donation> findByCampaignCode(String campaignCode);
    List<Donation> findByDonationDateBetween(Instant startDate, Instant endDate);
}