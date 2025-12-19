package com.hr.modules.notification.repository;

import com.hr.modules.notification.domain.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByCompanyIdOrderByCreatedAtDesc(Long companyId);
}
