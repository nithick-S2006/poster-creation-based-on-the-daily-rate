package com.srichairman.jewellers.controller;

import com.srichairman.jewellers.model.DailyRate;
import com.srichairman.jewellers.service.DailyRateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RateController {

    private final DailyRateService rateService;

    public RateController(DailyRateService rateService) {
        this.rateService = rateService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "UP");
        resp.put("shop", "SRI CHAIRMAN JEWELLERS");
        resp.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/rates/today")
    public ResponseEntity<DailyRate> getTodayRate() {
        return rateService.getLatestRate()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/rates/history")
    public ResponseEntity<List<DailyRate>> getHistory() {
        return ResponseEntity.ok(rateService.getAllRates());
    }

    @PostMapping("/rates")
    public ResponseEntity<DailyRate> saveRate(@RequestBody DailyRate rate) {
        DailyRate saved = rateService.saveOrUpdateRate(rate);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/rates/{id}")
    public ResponseEntity<Void> deleteRate(@PathVariable Long id) {
        boolean deleted = rateService.deleteRate(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
