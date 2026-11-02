package com.srichairman.jewellers.service;

import com.srichairman.jewellers.model.DailyRate;
import com.srichairman.jewellers.repository.DailyRateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DailyRateService {

    private final DailyRateRepository repository;

    public DailyRateService(DailyRateRepository repository) {
        this.repository = repository;
    }

    public List<DailyRate> getAllRates() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<DailyRate> getRateByDate(String date) {
        return repository.findByDate(date);
    }

    public Optional<DailyRate> getLatestRate() {
        List<DailyRate> list = repository.findAllByOrderByCreatedAtDesc();
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Transactional
    public DailyRate saveOrUpdateRate(DailyRate newRate) {
        Optional<DailyRate> existing = repository.findByDate(newRate.getDate());
        if (existing.isPresent()) {
            DailyRate rate = existing.get();
            rate.setGoldRate(newRate.getGoldRate());
            rate.setSilverRate(newRate.getSilverRate());
            if (newRate.getPosterFilename() != null) {
                rate.setPosterFilename(newRate.getPosterFilename());
            }
            if (newRate.getNotes() != null) {
                rate.setNotes(newRate.getNotes());
            }
            return repository.save(rate);
        } else {
            return repository.save(newRate);
        }
    }

    @Transactional
    public boolean deleteRate(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
