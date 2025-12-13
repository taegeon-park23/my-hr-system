package com.hr.modules.asset.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assets", uniqueConstraints = {
    @UniqueConstraint(name = "uk_asset_serial", columnNames = {"company_id", "serial_number"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "current_user_id")
    private Long currentUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetCategory category;

    @Column(name = "model_name", nullable = false)
    private String modelName;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "purchase_price", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal purchasePrice = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AssetStatus status = AssetStatus.AVAILABLE;

    @Column(columnDefinition = "TEXT")
    private String note;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum AssetCategory {
        LAPTOP, DESKTOP, MONITOR, ACCESSORY, SOFTWARE, FURNITURE, OTHER
    }

    public enum AssetStatus {
        AVAILABLE, ASSIGNED, BROKEN, REPAIRING, DISCARDED
    }

    public void assignToUser(Long userId) {
        this.currentUserId = userId;
        this.status = AssetStatus.ASSIGNED;
    }

    public void returnAsset() {
        this.currentUserId = null;
        this.status = AssetStatus.AVAILABLE;
    }

    public void updateStatus(AssetStatus status) {
        this.status = status;
    }
    
    public void updateInfo(String modelName, String serialNumber, String note) {
        this.modelName = modelName;
        this.serialNumber = serialNumber;
        this.note = note;
    }
}
