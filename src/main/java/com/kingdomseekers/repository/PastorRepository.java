package com.kingdomseekers.repository;

import com.kingdomseekers.entity.Pastor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PastorRepository extends JpaRepository<Pastor, Long> {
    Optional<Pastor> findByEmail(String email);
    List<Pastor> findByChurchBranch(String churchBranch);
    List<Pastor> findByCountryCode(String countryCode);
}