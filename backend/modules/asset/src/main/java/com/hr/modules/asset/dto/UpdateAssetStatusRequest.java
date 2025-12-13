package com.hr.modules.asset.dto;

import com.hr.modules.asset.domain.Asset;
import lombok.Data;

@Data
public class UpdateAssetStatusRequest {
    private Asset.AssetStatus status;
}
