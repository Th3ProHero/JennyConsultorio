package com.jennydentista.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DentistDTO {
    private Long id;
    private String name;
    private String specialty;
    private String phone;
}
