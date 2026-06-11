package com.jennydentista.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PatientDTO {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String insights;
    private String allergies;
    private Boolean isBlacklisted;
    private LocalDateTime createdAt;
}
