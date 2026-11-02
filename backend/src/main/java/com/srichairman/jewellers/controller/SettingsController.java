package com.srichairman.jewellers.controller;

import com.srichairman.jewellers.model.ShopSettings;
import com.srichairman.jewellers.service.ShopSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    private final ShopSettingsService settingsService;

    public SettingsController(ShopSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ResponseEntity<ShopSettings> getSettings() {
        return ResponseEntity.ok(settingsService.getSettings());
    }

    @PutMapping
    public ResponseEntity<ShopSettings> updateSettings(@RequestBody ShopSettings settings) {
        return ResponseEntity.ok(settingsService.updateSettings(settings));
    }
}
