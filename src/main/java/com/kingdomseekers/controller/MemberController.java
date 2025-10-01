package com.kingdomseekers.controller;

import com.kingdomseekers.entity.Member;
import com.kingdomseekers.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Member> createMember(@Valid @RequestBody Member member) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(memberService.createMember(member));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @Valid @RequestBody Member member) {
        return memberService.updateMember(id, member)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/vetting")
    public ResponseEntity<Member> updateVettingStatus(
            @PathVariable Long id,
            @RequestParam Member.VettingStatus status) {
        return memberService.updateVettingStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/assign-pastor/{pastorId}")
    public ResponseEntity<Member> assignPastor(
            @PathVariable Long id,
            @PathVariable Long pastorId) {
        return memberService.assignPastor(id, pastorId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/vetting/{status}")
    public ResponseEntity<List<Member>> getMembersByVettingStatus(
            @PathVariable Member.VettingStatus status) {
        return ResponseEntity.ok(memberService.getMembersByVettingStatus(status));
    }

    @GetMapping("/pastor/{pastorId}")
    public ResponseEntity<List<Member>> getMembersByPastor(@PathVariable Long pastorId) {
        return ResponseEntity.ok(memberService.getMembersByPastor(pastorId));
    }
}