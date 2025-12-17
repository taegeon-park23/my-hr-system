package com.hr.modules.recruitment.api.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class JobPostingCreateRequest {
    @NotBlank
    private String title;
    private String description;
}
