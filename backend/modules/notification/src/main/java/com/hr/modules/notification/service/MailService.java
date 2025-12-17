package com.hr.modules.notification.service;

import com.hr.modules.notification.domain.NotificationLog;
import com.hr.modules.notification.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;
    private final NotificationLogRepository logRepository;

    @org.springframework.scheduling.annotation.Async
    public void sendEmail(Long companyId, String to, String subject, String text, String eventType, Long resourceId) {
        NotificationLog.NotificationLogBuilder logBuilder = NotificationLog.builder()
                .companyId(companyId)
                .recipientEmail(to)
                .subject(subject)
                .message(text)
                .eventType(eventType)
                .relatedResourceId(resourceId);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom("noreply@hr-system.com");

            mailSender.send(message);
            
            logBuilder.status(NotificationLog.NotificationStatus.SENT);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}", to, e);
            logBuilder.status(NotificationLog.NotificationStatus.FAILED)
                    .errorMessage(e.getMessage());
        }

        logRepository.save(logBuilder.build());
    }
}
