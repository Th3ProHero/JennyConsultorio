package com.jennydentista.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clinics")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Clinic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 300)
    private String address;

    @Column(length = 150)
    private String hours;

    @Column(name = "map_url", length = 1000)
    private String mapUrl;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.sortOrder == null) this.sortOrder = 0;
    }
}
