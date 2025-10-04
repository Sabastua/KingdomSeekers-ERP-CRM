package com.kingdomseekers.service;

import com.kingdomseekers.entity.Booking;
import com.kingdomseekers.entity.Room;
import com.kingdomseekers.repository.BookingRepository;
import com.kingdomseekers.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    
    @Autowired
    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public Optional<Booking> getBookingByReference(String bookingReference) {
        return bookingRepository.findByBookingReference(bookingReference);
    }
    
    public Booking createBooking(Booking booking) {
        // Validate room availability
        Room room = booking.getRoom();
        if (room.getStatus() != Room.RoomStatus.AVAILABLE) {
            throw new IllegalArgumentException("Room is not available for booking");
        }
        
        // Check for date conflicts
        List<Booking> conflictingBookings = bookingRepository.findActiveBookingsOnDate(booking.getCheckInDate());
        boolean hasConflict = conflictingBookings.stream()
                .anyMatch(b -> b.getRoom().getId().equals(room.getId()) && 
                              !b.getStatus().equals(Booking.BookingStatus.CANCELLED));
        
        if (hasConflict) {
            throw new IllegalArgumentException("Room is already booked for the selected dates");
        }
        
        // Calculate total amount
        if (booking.getTotalAmount() == null) {
            int nights = booking.getNumberOfNights() != null ? booking.getNumberOfNights() : 
                        (int) java.time.temporal.ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
            booking.setTotalAmount(room.getPrice().multiply(java.math.BigDecimal.valueOf(nights)));
        }
        
        return bookingRepository.save(booking);
    }
    
    public Optional<Booking> updateBooking(Long id, Booking bookingDetails) {
        return bookingRepository.findById(id)
                .map(existingBooking -> {
                    existingBooking.setGuestName(bookingDetails.getGuestName());
                    existingBooking.setGuestEmail(bookingDetails.getGuestEmail());
                    existingBooking.setGuestPhone(bookingDetails.getGuestPhone());
                    existingBooking.setCheckInDate(bookingDetails.getCheckInDate());
                    existingBooking.setCheckOutDate(bookingDetails.getCheckOutDate());
                    existingBooking.setTotalAmount(bookingDetails.getTotalAmount());
                    existingBooking.setPaymentMethod(bookingDetails.getPaymentMethod());
                    existingBooking.setStatus(bookingDetails.getStatus());
                    existingBooking.setSpecialRequests(bookingDetails.getSpecialRequests());
                    return bookingRepository.save(existingBooking);
                });
    }
    
    public Optional<Booking> updateBookingStatus(Long id, Booking.BookingStatus status) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    booking.setStatus(status);
                    return bookingRepository.save(booking);
                });
    }
    
    public boolean deleteBooking(Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
    
    public List<Booking> getBookingsByRoom(Long roomId) {
        return bookingRepository.findByRoomId(roomId);
    }
    
    public List<Booking> getBookingsByGuestEmail(String guestEmail) {
        return bookingRepository.findByGuestEmail(guestEmail);
    }
    
    public List<Booking> getActiveBookingsOnDate(LocalDate date) {
        return bookingRepository.findActiveBookingsOnDate(date);
    }
    
    public List<Booking> getCheckInsForDate(LocalDate date) {
        return bookingRepository.findCheckInsForDate(date);
    }
    
    public List<Booking> getCheckOutsForDate(LocalDate date) {
        return bookingRepository.findCheckOutsForDate(date);
    }
    
    public Long getBookingCountByStatus(Booking.BookingStatus status) {
        return bookingRepository.countByStatus(status);
    }
    
    public Double getTotalRevenueForPeriod(LocalDate startDate, LocalDate endDate) {
        Double revenue = bookingRepository.getTotalRevenueForPeriod(startDate, endDate);
        return revenue != null ? revenue : 0.0;
    }
}
