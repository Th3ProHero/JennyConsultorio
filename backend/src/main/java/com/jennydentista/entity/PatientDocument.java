package com.jennydentista.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_documents")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PatientDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 100)
    private String type;

    @Column(columnDefinition = "TEXT")
    private String data; // Legacy Base64 Data URL — kept for backward compatibility

    @Lob
    @Column(columnDefinition = "BYTEA")
    private byte[] fileData; // Raw binary data stored directly in PostgreSQL

    @Column(name = "mime_type", length = 100)
    private String mimeType; // MIME type (image/jpeg, application/pdf, etc.)

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private DocumentTag tag; // Document category (RAYOS_X, RECETA_MEDICA, ESTUDIOS, OTROS)

    @Column(name = "created_at", updatable = false)
    private LocalDateTime date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @PrePersist
    protected void onCreate() {
        if (this.date == null) {
            this.date = LocalDateTime.now();
        }
    }
}
