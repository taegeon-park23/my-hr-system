package com.hr.modules.org.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.org.domain.Department;
import com.hr.modules.org.service.DepartmentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    public ApiResponse<Long> createDepartment(@RequestBody CreateDepartmentRequest request) {
        Long deptId = departmentService.createDepartment(
                request.getCompanyId(),
                request.getParentId(),
                request.getName()
        );
        return ApiResponse.success(deptId);
    }

    @GetMapping("/{id}")
    public ApiResponse<Department> getDepartment(@PathVariable Long id) {
        return ApiResponse.success(departmentService.getDepartment(id));
    }

    @Data
    public static class CreateDepartmentRequest {
        private Long companyId;
        private Long parentId;
        private String name;
    }
}
