package com.srichairman.jewellers.repository;

import com.srichairman.jewellers.model.ShopSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopSettingsRepository extends JpaRepository<ShopSettings, Long> {
}
