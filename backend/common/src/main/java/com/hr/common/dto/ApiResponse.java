package com.hr.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private ErrorResponse error;
    private Metadata metadata;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .metadata(Metadata.now())
                .build();
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ErrorResponse {
        private String code;
        private String message;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Metadata {
        private LocalDateTime timestamp;
        
        public static Metadata now() {
            return new Metadata(LocalDateTime.now());
        }
    }
}
