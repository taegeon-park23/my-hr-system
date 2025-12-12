package com.hr.modules.org.service;

import com.hr.modules.org.domain.Department;
import com.hr.modules.org.domain.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Transactional
    public Long createDepartment(Long companyId, Long parentId, String name) {
        int depth = 0;
        Department parent = null;
        if (parentId != null) {
            parent = departmentRepository.findById(parentId)
                    .orElseThrow(() -> new IllegalArgumentException("Parent department not found"));
            depth = parent.getDepth() + 1;
        }

        Department dept = new Department(companyId, parentId, name, depth);
        departmentRepository.save(dept);
        
        // Path String Logic (Simple version for now)
        String path = (parent != null && parent.getPathString() != null ? parent.getPathString() : "") + dept.getId() + ">";
        dept.setPathString(path);
        
        return dept.getId();
    }

    public Department getDepartment(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));
    }

    public List<Long> getSubDeptIds(Long deptId) {
        // Recursive implementation or path string based
        // For simplicity/MVP, only direct children for now, or assume path_string logic is robust
        // Let's implement recursive just in case using simple recursion (not efficient for deep trees but okay for MVP)
        // OR use path_string 'like' query if I had it.
        // Let's stick to direct children for this mvp step or recursive java logic.
        
        List<Long> result = new ArrayList<>();
        collectSubIds(deptId, result);
        return result;
    }
    
    // Naive recursion
    private void collectSubIds(Long currentId, List<Long> result) {
        List<Department> children = departmentRepository.findByParentId(currentId);
        for (Department child : children) {
            result.add(child.getId());
            collectSubIds(child.getId(), result);
        }
    }
}
