package com.hr.modules.notification.repository;

import com.hr.modules.notification.domain.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
}
