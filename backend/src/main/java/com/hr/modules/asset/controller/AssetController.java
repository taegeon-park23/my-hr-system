package com.hr.modules.asset.controller;

import com.hr.modules.asset.domain.Asset;
import com.hr.modules.asset.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @GetMapping("/my")
    public ResponseEntity<List<Asset>> getMyAssets(@RequestParam Long userId) {
        return ResponseEntity.ok(assetService.getMyAssets(userId));
    }
}
