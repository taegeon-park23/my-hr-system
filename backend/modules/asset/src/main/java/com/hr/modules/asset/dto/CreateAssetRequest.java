package com.hr.modules.asset.dto;

import com.hr.modules.asset.domain.Asset;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateAssetRequest {
    private Long companyId;
    private Asset.AssetCategory category;
    private String modelName;
    private String serialNumber;
    private LocalDate purchaseDate;
    private BigDecimal purchasePrice;
    private String note;
}
