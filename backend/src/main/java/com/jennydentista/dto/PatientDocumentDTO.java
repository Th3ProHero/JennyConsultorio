package com.jennydentista.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PatientDocumentDTO {
    private Long id;
    private String name;
    private String type;      // Legacy MIME type field
    private String data;      // Legacy Base64 data (only used in old create/update flows)
    private String mimeType;  // MIME type for new uploads
    private String tag;       // DocumentTag enum name (RAYOS_X, RECETA_MEDICA, etc.)
    private String fileUrl;   // Computed URL to serve the document binary
    private LocalDateTime date;
}
