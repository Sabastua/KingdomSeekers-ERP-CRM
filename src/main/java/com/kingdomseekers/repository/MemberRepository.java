package com.kingdomseekers.repository;

import com.kingdomseekers.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    List<Member> findByVettingStatus(Member.VettingStatus status);
    List<Member> findByAssignedPastorId(Long pastorId);
    List<Member> findByCountryOfResidence(String countryCode);
}