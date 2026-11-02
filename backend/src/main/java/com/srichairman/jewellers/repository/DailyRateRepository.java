package com.srichairman.jewellers.repository;

import com.srichairman.jewellers.model.DailyRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DailyRateRepository extends JpaRepository<DailyRate, Long> {
    Optional<DailyRate> findByDate(String date);
    List<DailyRate> findAllByOrderByCreatedAtDesc();
}
