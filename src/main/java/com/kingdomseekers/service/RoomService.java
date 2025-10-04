package com.kingdomseekers.service;

import com.kingdomseekers.entity.Room;
import com.kingdomseekers.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    
    private final RoomRepository roomRepository;
    
    @Autowired
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }
    
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }
    
    public Optional<Room> getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber);
    }
    
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }
    
    public Optional<Room> updateRoom(Long id, Room roomDetails) {
        return roomRepository.findById(id)
                .map(existingRoom -> {
                    existingRoom.setRoomNumber(roomDetails.getRoomNumber());
                    existingRoom.setType(roomDetails.getType());
                    existingRoom.setCapacity(roomDetails.getCapacity());
                    existingRoom.setPackageType(roomDetails.getPackageType());
                    existingRoom.setPrice(roomDetails.getPrice());
                    existingRoom.setStatus(roomDetails.getStatus());
                    existingRoom.setDescription(roomDetails.getDescription());
                    existingRoom.setAmenities(roomDetails.getAmenities());
                    return roomRepository.save(existingRoom);
                });
    }
    
    public boolean deleteRoom(Long id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<Room> getRoomsByStatus(Room.RoomStatus status) {
        return roomRepository.findByStatus(status);
    }
    
    public List<Room> getRoomsByType(Room.RoomType type) {
        return roomRepository.findByType(type);
    }
    
    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus(Room.RoomStatus.AVAILABLE);
    }
    
    public List<Room> getAvailableRoomsByType(Room.RoomType type) {
        return roomRepository.findAvailableRoomsByType(type);
    }
    
    public Long getTotalRoomCount() {
        return roomRepository.getTotalRoomCount();
    }
    
    public Long getAvailableRoomCount() {
        return roomRepository.countByStatus(Room.RoomStatus.AVAILABLE);
    }
    
    public Long getOccupiedRoomCount() {
        return roomRepository.countByStatus(Room.RoomStatus.OCCUPIED);
    }
    
    public Double getOccupancyRate() {
        Long totalRooms = getTotalRoomCount();
        if (totalRooms == 0) return 0.0;
        Long occupiedRooms = getOccupiedRoomCount();
        return (occupiedRooms.doubleValue() / totalRooms.doubleValue()) * 100;
    }
}
