package com.kingdomseekers.repository;

import com.kingdomseekers.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByTransactionReference(String transactionReference);
    
    Optional<Payment> findByPaymentReference(String paymentReference);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    List<Payment> findByPaymentMethod(Payment.PaymentMethod paymentMethod);
    
    List<Payment> findByBookingId(Long bookingId);
    
    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findByPaymentDateBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paymentDate BETWEEN :startDate AND :endDate")
    Double getTotalPaymentsForPeriod(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentMethod = :method AND p.status = 'COMPLETED'")
    Long countByPaymentMethod(@Param("method") Payment.PaymentMethod method);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentMethod = :method AND p.status = 'COMPLETED'")
    Double getTotalAmountByPaymentMethod(@Param("method") Payment.PaymentMethod method);
}
