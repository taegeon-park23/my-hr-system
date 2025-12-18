package com.hr.queries.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentStatDto {
    private Long deptId;
    private String deptName;
    private long employeeCount;
}
