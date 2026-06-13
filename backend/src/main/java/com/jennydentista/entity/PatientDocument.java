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

    @Column(nullable = false, columnDefinition = "TEXT")
    private String data; // Base64 Data URL

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
