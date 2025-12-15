package com.hr.modules.asset.dto;

import com.hr.modules.asset.domain.Asset;
import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class AssetResponse {
    private Long id;
    private Asset.AssetCategory category;
    private String modelName;
    private String serialNumber;
    private LocalDate purchaseDate;
    private BigDecimal purchasePrice;
    private Asset.AssetStatus status;
    private String note;
    private Long currentUserId;

    public static AssetResponse from(Asset asset) {
        return AssetResponse.builder()
                .id(asset.getId())
                .category(asset.getCategory())
                .modelName(asset.getModelName())
                .serialNumber(asset.getSerialNumber())
                .purchaseDate(asset.getPurchaseDate())
                .purchasePrice(asset.getPurchasePrice())
                .status(asset.getStatus())
                .note(asset.getNote())
                .currentUserId(asset.getCurrentUserId())
                .build();
    }
}
