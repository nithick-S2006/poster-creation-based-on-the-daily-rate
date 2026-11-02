package com.srichairman.jewellers.model;

import jakarta.persistence.*;

@Entity
@Table(name = "shop_settings")
public class ShopSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shopName;
    private String tamilShopName;
    private String addressLine1;
    private String addressLine2;
    private String goldPurity;
    private String silverPurity;
    private String footerText;
    private String whatsappNumber;
    private String subtitleText;
    private String tamilFont;
    private String posterMode;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String customLogoUrl;

    public ShopSettings() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public String getTamilShopName() { return tamilShopName; }
    public void setTamilShopName(String tamilShopName) { this.tamilShopName = tamilShopName; }

    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }

    public String getGoldPurity() { return goldPurity; }
    public void setGoldPurity(String goldPurity) { this.goldPurity = goldPurity; }

    public String getSilverPurity() { return silverPurity; }
    public void setSilverPurity(String silverPurity) { this.silverPurity = silverPurity; }

    public String getFooterText() { return footerText; }
    public void setFooterText(String footerText) { this.footerText = footerText; }

    public String getWhatsappNumber() { return whatsappNumber; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }

    public String getSubtitleText() { return subtitleText; }
    public void setSubtitleText(String subtitleText) { this.subtitleText = subtitleText; }

    public String getTamilFont() { return tamilFont; }
    public void setTamilFont(String tamilFont) { this.tamilFont = tamilFont; }

    public String getPosterMode() { return posterMode; }
    public void setPosterMode(String posterMode) { this.posterMode = posterMode; }

    public String getCustomLogoUrl() { return customLogoUrl; }
    public void setCustomLogoUrl(String customLogoUrl) { this.customLogoUrl = customLogoUrl; }
}
