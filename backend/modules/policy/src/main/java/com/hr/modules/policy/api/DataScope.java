package com.hr.modules.policy.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataScope {
    private ScopeType type;
    private Long companyId;
    private List<Long> targetIds; // userIds or deptIds depending on context, or just IDs to filter IN
    
    public enum ScopeType {
        GLOBAL_ALL,     // Super Admin
        COMPANY_WIDE,   // Tenant Admin
        DEPT_TREE,      // Manager (My Dept + Sub Depts)
        USER_ONLY       // Employee (My Data)
    }
}
