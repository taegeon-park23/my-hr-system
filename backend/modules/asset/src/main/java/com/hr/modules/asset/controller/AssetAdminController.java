package com.hr.modules.asset.controller;

import com.hr.modules.asset.domain.Asset;
import com.hr.modules.asset.dto.AssignAssetRequest;
import com.hr.modules.asset.dto.CreateAssetRequest;
import com.hr.modules.asset.dto.UpdateAssetStatusRequest;
import com.hr.modules.asset.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/assets")
@RequiredArgsConstructor
public class AssetAdminController {

    private final AssetService assetService;

    @PostMapping
    public ResponseEntity<Asset> createAsset(@RequestBody CreateAssetRequest request) {
        Asset asset = Asset.builder()
                .companyId(request.getCompanyId())
                .category(request.getCategory())
                .modelName(request.getModelName())
                .serialNumber(request.getSerialNumber())
                .purchaseDate(request.getPurchaseDate())
                .purchasePrice(request.getPurchasePrice())
                .note(request.getNote())
                .build();
        return ResponseEntity.ok(assetService.registerAsset(asset));
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getAssets(@RequestParam Long companyId) {
        return ResponseEntity.ok(assetService.getAssetsByCompany(companyId));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<Asset> assignAsset(@PathVariable Long id, @RequestBody AssignAssetRequest request) {
        return ResponseEntity.ok(assetService.assignAsset(id, request.getUserId()));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<Asset> returnAsset(@PathVariable Long id) {
        return ResponseEntity.ok(assetService.returnAsset(id));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Asset> updateStatus(@PathVariable Long id, @RequestBody UpdateAssetStatusRequest request) {
        return ResponseEntity.ok(assetService.updateStatus(id, request.getStatus()));
    }
}
