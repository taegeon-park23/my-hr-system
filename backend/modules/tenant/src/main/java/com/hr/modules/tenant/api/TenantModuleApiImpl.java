package com.hr.modules.tenant.api;

import com.hr.modules.tenant.domain.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TenantModuleApiImpl implements TenantModuleApi {

    private final TenantRepository tenantRepository;

    @Override
    public boolean isValidTenant(Long companyId) {
        return tenantRepository.existsById(companyId);
    }
}
