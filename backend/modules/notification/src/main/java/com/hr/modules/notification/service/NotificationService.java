package com.hr.modules.notification.service;

import com.hr.modules.notification.domain.Announcement;
import com.hr.modules.notification.domain.InAppNotification;
import com.hr.modules.notification.repository.AnnouncementRepository;
import com.hr.modules.notification.repository.InAppNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final AnnouncementRepository announcementRepository;
    private final InAppNotificationRepository inAppNotificationRepository;

    public List<Announcement> getAnnouncements(Long companyId) {
        return announcementRepository.findAllByCompanyIdOrderByCreatedAtDesc(companyId);
    }

    @Transactional
    public Announcement createAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    public List<InAppNotification> getNotifications(Long userId) {
        return inAppNotificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        inAppNotificationRepository.findById(notificationId)
                .ifPresent(InAppNotification::markAsRead);
    }

    @Transactional
    public void createNotification(Long companyId, Long recipientId, String message, String link) {
        InAppNotification notification = InAppNotification.builder()
                .companyId(companyId)
                .recipientId(recipientId)
                .message(message)
                .link(link)
                .read(false)
                .build();
        inAppNotificationRepository.save(notification);
    }
}
