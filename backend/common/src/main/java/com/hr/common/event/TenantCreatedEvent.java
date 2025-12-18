package com.hr.common.event;

import lombok.Getter;

@Getter
public class TenantCreatedEvent extends DomainEvent {
    private final Long tenantId;
    private final String tenantName;
    private final String adminEmail;

    public TenantCreatedEvent(Long tenantId, String tenantName, String adminEmail) {
        super();
        this.tenantId = tenantId;
        this.tenantName = tenantName;
        this.adminEmail = adminEmail;
    }
}
