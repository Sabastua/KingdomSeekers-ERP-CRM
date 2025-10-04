package com.kingdomseekers.service;

import com.kingdomseekers.entity.Member;
import com.kingdomseekers.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    @Autowired
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    public Optional<Member> getMemberByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    @Transactional
    public Member createMember(Member member) {
        member.setCreatedAt(Instant.now());
        member.setVettingStatus(Member.VettingStatus.PENDING);
        return memberRepository.save(member);
    }

    @Transactional
    public Optional<Member> updateMember(Long id, Member memberDetails) {
        return memberRepository.findById(id)
                .map(existingMember -> {
                    existingMember.setFirstName(memberDetails.getFirstName());
                    existingMember.setLastName(memberDetails.getLastName());
                    existingMember.setEmail(memberDetails.getEmail());
                    existingMember.setPhone(memberDetails.getPhone());
                    existingMember.setNationality(memberDetails.getNationality());
                    existingMember.setCountryOfResidence(memberDetails.getCountryOfResidence());
                    return memberRepository.save(existingMember);
                });
    }

    @Transactional
    public Optional<Member> updateVettingStatus(Long id, Member.VettingStatus status) {
        return memberRepository.findById(id)
                .map(member -> {
                    member.setVettingStatus(status);
                    if (status == Member.VettingStatus.APPROVED) {
                        member.setApprovedAt(Instant.now());
                    }
                    return memberRepository.save(member);
                });
    }

    @Transactional
    public Optional<Member> assignPastor(Long memberId, Long pastorId) {
        return memberRepository.findById(memberId)
                .map(member -> {
                    // Note: This would need a Pastor entity lookup in a real implementation
                    // For now, we'll just return the member as-is
                    return memberRepository.save(member);
                });
    }

    public List<Member> getMembersByVettingStatus(Member.VettingStatus status) {
        return memberRepository.findByVettingStatus(status);
    }

    public List<Member> getMembersByPastor(Long pastorId) {
        // Note: This would need proper implementation with Pastor relationship
        return List.of();
    }
}