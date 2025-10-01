package com.kingdomseekers.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "pastors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pastor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String firstName;
    private String lastName;
    private String email;
    private String churchBranch;
    private String countryCode;
    private Instant createdAt = Instant.now();
}