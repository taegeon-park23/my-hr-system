package com.hr.modules.tenant.repository;

import com.hr.modules.tenant.domain.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByDomain(String domain);
}

