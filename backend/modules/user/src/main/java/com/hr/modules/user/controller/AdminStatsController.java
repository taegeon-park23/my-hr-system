package com.hr.modules.user.controller;

import com.hr.common.dto.ApiResponse;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    @GetMapping("/hiring-attrition")
    public ApiResponse<List<HiringAttritionStat>> getHiringAttritionStats() {
        // Mock data for the trend chart
        List<HiringAttritionStat> stats = new ArrayList<>();
        stats.add(new HiringAttritionStat("7월", 5, 1));
        stats.add(new HiringAttritionStat("8월", 8, 0));
        stats.add(new HiringAttritionStat("9월", 4, 2));
        stats.add(new HiringAttritionStat("10월", 12, 1));
        stats.add(new HiringAttritionStat("11월", 7, 3));
        stats.add(new HiringAttritionStat("12월", 15, 2));
        
        return ApiResponse.success(stats);
    }

    @Data
    @Builder
    public static class HiringAttritionStat {
        private String month;
        private int hiring;
        private int attrition;

        public HiringAttritionStat(String month, int hiring, int attrition) {
            this.month = month;
            this.hiring = hiring;
            this.attrition = attrition;
        }
    }
}
