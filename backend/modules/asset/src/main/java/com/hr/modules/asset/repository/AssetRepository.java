package com.hr.modules.asset.repository;

import com.hr.modules.asset.domain.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByCompanyId(Long companyId);
    List<Asset> findByCurrentUserId(Long userId);
    List<Asset> findByCompanyIdAndStatus(Long companyId, Asset.AssetStatus status);
}
