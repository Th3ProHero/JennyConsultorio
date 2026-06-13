package com.jennydentista.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "patients")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(name = "insights", columnDefinition = "TEXT")
    private String insights;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "is_blacklisted")
    private Boolean isBlacklisted = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<PatientDocument> documents;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
