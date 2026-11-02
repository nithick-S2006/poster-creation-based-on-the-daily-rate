package com.srichairman.jewellers.service;

import com.srichairman.jewellers.model.ShopSettings;
import com.srichairman.jewellers.repository.ShopSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShopSettingsService {

    private final ShopSettingsRepository repository;

    public ShopSettingsService(ShopSettingsRepository repository) {
        this.repository = repository;
    }

    public ShopSettings getSettings() {
        List<ShopSettings> all = repository.findAll();
        if (!all.isEmpty()) {
            return all.get(0);
        }
        // Create default
        ShopSettings def = new ShopSettings();
        def.setShopName("SRI CHAIRMAN JEWELLERS");
        def.setTamilShopName("ஸ்ரீ சேர்மன் ஜூவல்லர்ஸ்");
        def.setAddressLine1("12, BIG BAZAAR STREET,");
        def.setAddressLine2("RASIPURAM - 637408");
        def.setGoldPurity("22 கேரட் (22k)");
        def.setSilverPurity("Silver – Per Gram");
        def.setFooterText("வாடிக்கையாளர்களின் ஆதரவுக்கு நன்றி!");
        def.setWhatsappNumber("+919876543210");
        def.setSubtitleText("இன்றைய தங்கம் மற்றும் வெள்ளி விலை நிலவரம்");
        def.setTamilFont("Noto Sans Tamil");
        def.setPosterMode("original_match");
        return repository.save(def);
    }

    @Transactional
    public ShopSettings updateSettings(ShopSettings update) {
        ShopSettings current = getSettings();
        current.setShopName(update.getShopName());
        current.setTamilShopName(update.getTamilShopName());
        current.setAddressLine1(update.getAddressLine1());
        current.setAddressLine2(update.getAddressLine2());
        current.setGoldPurity(update.getGoldPurity());
        current.setSilverPurity(update.getSilverPurity());
        current.setFooterText(update.getFooterText());
        current.setWhatsappNumber(update.getWhatsappNumber());
        current.setSubtitleText(update.getSubtitleText());
        current.setTamilFont(update.getTamilFont());
        current.setPosterMode(update.getPosterMode());
        if (update.getCustomLogoUrl() != null) {
            current.setCustomLogoUrl(update.getCustomLogoUrl());
        }
        return repository.save(current);
    }
}
