package com.jennydentista.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ClinicDTO {
    private Long id;
    private String name;
    private String address;
    private String hours;
    private String mapUrl;
    private Integer sortOrder;
}
