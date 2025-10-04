package com.kingdomseekers.repository;

import com.kingdomseekers.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Optional<Booking> findByBookingReference(String bookingReference);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    List<Booking> findByRoomId(Long roomId);
    
    List<Booking> findByGuestEmail(String guestEmail);
    
    List<Booking> findByCheckInDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Booking> findByCheckOutDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT b FROM Booking b WHERE b.checkInDate <= :date AND b.checkOutDate > :date")
    List<Booking> findActiveBookingsOnDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    Long countByStatus(@Param("status") Booking.BookingStatus status);
    
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.status = 'CONFIRMED' AND b.checkInDate >= :startDate AND b.checkInDate <= :endDate")
    Double getTotalRevenueForPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT b FROM Booking b WHERE b.checkInDate = :date AND b.status IN ('CONFIRMED', 'CHECKED_IN')")
    List<Booking> findCheckInsForDate(@Param("date") LocalDate date);
    
    @Query("SELECT b FROM Booking b WHERE b.checkOutDate = :date AND b.status IN ('CHECKED_IN', 'CONFIRMED')")
    List<Booking> findCheckOutsForDate(@Param("date") LocalDate date);
}
