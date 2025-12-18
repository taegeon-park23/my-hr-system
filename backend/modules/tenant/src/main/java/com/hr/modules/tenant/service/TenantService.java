package com.hr.modules.tenant.service;

import com.hr.modules.tenant.domain.Tenant;
import com.hr.modules.tenant.domain.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TenantService {

    private final TenantRepository tenantRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    @Transactional
    public Long createTenant(String name, String domain, String planType) {
        if (tenantRepository.existsByDomain(domain)) {
            throw new IllegalArgumentException("Domain already exists: " + domain);
        }
        Tenant tenant = new Tenant(name, domain, planType);
        tenantRepository.save(tenant);
        
        eventPublisher.publishEvent(new com.hr.common.event.TenantCreatedEvent(
                tenant.getId(), tenant.getName(), "admin@" + domain));
                
        return tenant.getId();
    }

    public Tenant getTenant(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found: " + id));
    }

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }
}
