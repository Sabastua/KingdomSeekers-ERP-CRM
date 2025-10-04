package com.kingdomseekers.repository;

import com.kingdomseekers.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    Optional<Room> findByRoomNumber(String roomNumber);
    
    List<Room> findByStatus(Room.RoomStatus status);
    
    List<Room> findByType(Room.RoomType type);
    
    List<Room> findByPackageType(Room.PackageType packageType);
    
    List<Room> findByCapacityGreaterThanEqual(Integer capacity);
    
    @Query("SELECT r FROM Room r WHERE r.price BETWEEN :minPrice AND :maxPrice")
    List<Room> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    @Query("SELECT COUNT(r) FROM Room r WHERE r.status = :status")
    Long countByStatus(@Param("status") Room.RoomStatus status);
    
    @Query("SELECT COUNT(r) FROM Room r")
    Long getTotalRoomCount();
    
    @Query("SELECT r FROM Room r WHERE r.status = 'AVAILABLE' AND r.type = :type")
    List<Room> findAvailableRoomsByType(@Param("type") Room.RoomType type);
}
