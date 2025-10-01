package com.kingdomseekers.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Member member;
    
    private BigDecimal amount;
    private String currency;
    
    @Enumerated(EnumType.STRING)
    private DonationType type;
    
    private String campaignCode;
    private String transactionReference;
    private String paymentMethod;
    private Instant donationDate = Instant.now();
    
    public enum DonationType {
        TITHE, OFFERING, SPECIAL_PROJECT, MISSIONARY, OTHER
    }
}