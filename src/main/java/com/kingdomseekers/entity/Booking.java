package com.kingdomseekers.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "booking_reference", unique = true, nullable = false)
    private String bookingReference;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
    
    @Column(name = "guest_name", nullable = false)
    private String guestName;
    
    @Column(name = "guest_email", nullable = false)
    private String guestEmail;
    
    @Column(name = "guest_phone")
    private String guestPhone;
    
    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;
    
    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;
    
    @Column(name = "number_of_nights")
    private Integer numberOfNights;
    
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;
    
    @Column(name = "special_requests")
    private String specialRequests;
    
    @Column(name = "created_at")
    private Instant createdAt = Instant.now();
    
    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();
    
    public enum PaymentMethod {
        M_PESA, BANK_TRANSFER, CASH, CREDIT_CARD
    }
    
    public enum BookingStatus {
        PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW
    }
    
    @PrePersist
    public void prePersist() {
        if (this.bookingReference == null) {
            this.bookingReference = "HG-" + System.currentTimeMillis();
        }
        if (this.checkInDate != null && this.checkOutDate != null) {
            this.numberOfNights = (int) java.time.temporal.ChronoUnit.DAYS.between(this.checkInDate, this.checkOutDate);
        }
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
        if (this.checkInDate != null && this.checkOutDate != null) {
            this.numberOfNights = (int) java.time.temporal.ChronoUnit.DAYS.between(this.checkInDate, this.checkOutDate);
        }
    }
}
