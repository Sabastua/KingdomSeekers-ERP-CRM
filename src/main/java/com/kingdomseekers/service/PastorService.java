package com.kingdomseekers.service;

import com.kingdomseekers.entity.Pastor;
import com.kingdomseekers.repository.PastorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class PastorService {

    private final PastorRepository pastorRepository;

    @Autowired
    public PastorService(PastorRepository pastorRepository) {
        this.pastorRepository = pastorRepository;
    }

    public List<Pastor> getAllPastors() {
        return pastorRepository.findAll();
    }

    public Optional<Pastor> getPastorById(Long id) {
        return pastorRepository.findById(id);
    }

    @Transactional
    public Pastor createPastor(Pastor pastor) {
        pastor.setCreatedAt(Instant.now());
        return pastorRepository.save(pastor);
    }

    public List<Pastor> getPastorsByChurchBranch(String churchBranch) {
        return pastorRepository.findByChurchBranch(churchBranch);
    }

    public List<Pastor> getPastorsByCountry(String countryCode) {
        return pastorRepository.findByCountryCode(countryCode);
    }
}