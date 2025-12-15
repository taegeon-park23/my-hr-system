package com.hr.modules.asset.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.asset.dto.AssetResponse;
import com.hr.modules.asset.service.AssetService;
import com.hr.common.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @GetMapping("/my")
    public ApiResponse<List<AssetResponse>> getMyAssets(@AuthenticationPrincipal UserPrincipal user) {
        return ApiResponse.success(
            assetService.getMyAssets(user.getId())
                        .stream()
                        .map(AssetResponse::from)
                        .collect(Collectors.toList())
        );
    }
}
