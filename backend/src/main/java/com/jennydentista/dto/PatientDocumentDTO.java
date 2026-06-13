package com.jennydentista.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PatientDocumentDTO {
    private Long id;
    private String name;
    private String type;
    private String data;
    private LocalDateTime date;
}
