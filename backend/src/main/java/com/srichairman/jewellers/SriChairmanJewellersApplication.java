package com.srichairman.jewellers;

import com.srichairman.jewellers.model.DailyRate;
import com.srichairman.jewellers.service.DailyRateService;
import com.srichairman.jewellers.service.ShopSettingsService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@SpringBootApplication
public class SriChairmanJewellersApplication {

    public static void main(String[] args) {
        SpringApplication.run(SriChairmanJewellersApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(DailyRateService rateService, ShopSettingsService settingsService) {
        return args -> {
            // Initialize settings
            settingsService.getSettings();

            // Seed initial reference rate if history is empty
            if (rateService.getAllRates().isEmpty()) {
                String today = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                DailyRate initialRate = new DailyRate(
                        today,
                        12985.0,
                        190.0,
                        "SRI_CHAIRMAN_JEWELLERS_DAILY_RATE_" + today + ".png"
                );
                initialRate.setNotes("Initial opening rate");
                rateService.saveOrUpdateRate(initialRate);
            }
        };
    }
}
