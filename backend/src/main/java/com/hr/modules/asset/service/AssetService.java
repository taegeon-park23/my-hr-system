package com.hr.modules.asset.service;

import com.hr.modules.asset.domain.Asset;
import com.hr.modules.asset.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetService {

    private final AssetRepository assetRepository;

    @Transactional
    public Asset registerAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    public List<Asset> getAssetsByCompany(Long companyId) {
        return assetRepository.findByCompanyId(companyId);
    }

    public List<Asset> getMyAssets(Long userId) {
        return assetRepository.findByCurrentUserId(userId);
    }

    @Transactional
    public Asset assignAsset(Long assetId, Long userId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found: " + assetId));
        
        if (asset.getStatus() != Asset.AssetStatus.AVAILABLE) {
            throw new IllegalStateException("Asset is not available for assignment");
        }

        asset.assignToUser(userId);
        return asset;
    }

    @Transactional
    public Asset returnAsset(Long assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found: " + assetId));
        
        asset.returnAsset();
        return asset;
    }

    @Transactional
    public Asset updateStatus(Long assetId, Asset.AssetStatus status) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found: " + assetId));
        
        asset.updateStatus(status);
        return asset;
    }
}
