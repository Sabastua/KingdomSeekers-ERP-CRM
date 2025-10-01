package com.kingdomseekers.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String firstName;
    private String lastName;
    private String email;
    private String nationality;
    private String countryOfResidence;
    private String phone;
    
    @Enumerated(EnumType.STRING)
    private VettingStatus vettingStatus = VettingStatus.PENDING;
    
    @ManyToOne
    private Pastor assignedPastor;
    
    private Instant approvedAt;
    private Instant createdAt = Instant.now();
    
    public enum VettingStatus {
        PENDING, APPROVED, REJECTED
    }
}