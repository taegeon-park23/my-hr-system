package com.hr.modules.notification.controller;

import com.hr.common.dto.ApiResponse;
import com.hr.modules.notification.controller.dto.AnnouncementResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    @GetMapping("/announcements")
    public ApiResponse<List<AnnouncementResponse>> getAnnouncements() {
        // MVP: Return static list of announcements
        return ApiResponse.success(List.of(
            AnnouncementResponse.builder()
                .id(1L)
                .title("2024년 연봉 협상 안내")
                .author("인사팀")
                .createdAt(LocalDateTime.now().minusDays(1))
                .type("NOTICE")
                .build(),
            AnnouncementResponse.builder()
                .id(2L)
                .title("[공지] 연말 정산 서류 제출 기한 안내")
                .author("인사팀")
                .createdAt(LocalDateTime.now().minusDays(3))
                .type("URGENT")
                .build(),
            AnnouncementResponse.builder()
                .id(3L)
                .title("신규 입사자 교육 일정 안내")
                .author("경영지원")
                .createdAt(LocalDateTime.now().minusDays(5))
                .type("NOTICE")
                .build()
        ));
    }
}
