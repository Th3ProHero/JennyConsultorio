package com.jennydentista.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class NoteDTO {
    private Long id;
    private String text;
    private String category;
    private String color;
    private Boolean isCompleted;
    private LocalDateTime createdAt;
}
