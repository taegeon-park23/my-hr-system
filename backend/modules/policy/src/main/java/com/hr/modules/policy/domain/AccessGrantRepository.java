package com.hr.modules.policy.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface AccessGrantRepository extends JpaRepository<AccessGrant, Long> {
    List<AccessGrant> findByGranteeUserIdAndResourceTypeAndExpirationTimeAfter(Long granteeUserId, String resourceType, LocalDateTime now);
}
