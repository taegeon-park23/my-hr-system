package com.hr.queries.org.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.queries.org.dto.OrgChartNode;
import com.hr.queries.org.service.OrgChartQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/org")
public class OrgChartController {

    private final OrgChartQueryService orgChartQueryService;

    @Autowired
    public OrgChartController(OrgChartQueryService orgChartQueryService) {
        this.orgChartQueryService = orgChartQueryService;
    }

    @GetMapping("/tree/{companyId}")
    public ApiResponse<List<OrgChartNode>> getOrgTree(@PathVariable Long companyId) {
        // In real app, companyId should come from Token/Context
        return ApiResponse.success(orgChartQueryService.getOrgChart(companyId));
    }
}
