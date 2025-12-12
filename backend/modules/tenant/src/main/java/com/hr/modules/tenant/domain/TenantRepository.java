package com.hr.modules.tenant.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByDomain(String domain);
    boolean existsByDomain(String domain);
}
