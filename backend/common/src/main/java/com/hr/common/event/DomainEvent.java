package com.hr.common.event;

import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public abstract class DomainEvent {
    private final LocalDateTime occurredOn;

    protected DomainEvent() {
        this.occurredOn = LocalDateTime.now();
    }
}
