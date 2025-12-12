package com.hr.modules.user.service;

import com.hr.modules.user.domain.User;
import com.hr.modules.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public Long createUser(Long companyId, String email, String passwordHash, String name, String employeeNumber, User.UserRole role, LocalDate hireDate) {
        if (userRepository.existsByCompanyIdAndEmployeeNumber(companyId, employeeNumber)) {
            throw new IllegalArgumentException("Employee number already exists in this company.");
        }
        User user = new User(companyId, email, passwordHash, name, employeeNumber, role, hireDate);
        userRepository.save(user);
        return user.getId();
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
    }
    
    public List<User> getDeptMembers(Long deptId) {
        return userRepository.findByDeptId(deptId);
    }
}
