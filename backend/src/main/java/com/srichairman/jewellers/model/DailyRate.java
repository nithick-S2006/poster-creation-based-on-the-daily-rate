package com.srichairman.jewellers.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_rates")
public class DailyRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String date; // Format: DD-MM-YYYY

    @Column(nullable = false)
    private Double goldRate;

    @Column(nullable = false)
    private Double silverRate;

    private String posterFilename;

    private String notes;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public DailyRate() {}

    public DailyRate(String date, Double goldRate, Double silverRate, String posterFilename) {
        this.date = date;
        this.goldRate = goldRate;
        this.silverRate = silverRate;
        this.posterFilename = posterFilename;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Double getGoldRate() { return goldRate; }
    public void setGoldRate(Double goldRate) { this.goldRate = goldRate; }

    public Double getSilverRate() { return silverRate; }
    public void setSilverRate(Double silverRate) { this.silverRate = silverRate; }

    public String getPosterFilename() { return posterFilename; }
    public void setPosterFilename(String posterFilename) { this.posterFilename = posterFilename; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
