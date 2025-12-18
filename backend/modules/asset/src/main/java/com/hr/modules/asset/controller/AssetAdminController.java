package com.hr.modules.asset.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.asset.domain.Asset;
import com.hr.modules.asset.dto.AssignAssetRequest;
import com.hr.modules.asset.dto.CreateAssetRequest;
import com.hr.modules.asset.dto.UpdateAssetStatusRequest;
import com.hr.modules.asset.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/assets")
@RequiredArgsConstructor
public class AssetAdminController {

    private final AssetService assetService;

    @PostMapping
    public ApiResponse<Asset> createAsset(@RequestBody CreateAssetRequest request) {
        Asset asset = Asset.builder()
                .companyId(request.getCompanyId())
                .category(request.getCategory())
                .modelName(request.getModelName())
                .serialNumber(request.getSerialNumber() != null && !request.getSerialNumber().isEmpty() ? request.getSerialNumber() : null)
                .purchaseDate(request.getPurchaseDate())
                .purchasePrice(request.getPurchasePrice())
                .note(request.getNote())
                .build();
        return ApiResponse.success(assetService.registerAsset(asset));
    }

    @GetMapping
    public ApiResponse<List<Asset>> getAssets(@RequestParam Long companyId) {
        return ApiResponse.success(assetService.getAssetsByCompany(companyId));
    }

    @PostMapping("/{id}/assign")
    public ApiResponse<Asset> assignAsset(@PathVariable Long id, @RequestBody AssignAssetRequest request) {
        return ApiResponse.success(assetService.assignAsset(id, request.getUserId()));
    }

    @PostMapping("/{id}/return")
    public ApiResponse<Asset> returnAsset(@PathVariable Long id) {
        return ApiResponse.success(assetService.returnAsset(id));
    }
    
    @PatchMapping("/{id}/status")
    public ApiResponse<Asset> updateStatus(@PathVariable Long id, @RequestBody UpdateAssetStatusRequest request) {
        return ApiResponse.success(assetService.updateStatus(id, request.getStatus()));
    }
}
