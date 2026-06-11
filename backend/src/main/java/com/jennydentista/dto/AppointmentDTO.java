package com.jennydentista.dto;

import com.jennydentista.entity.AppointmentStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AppointmentDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long dentistId;
    private String dentistName;
    private Long serviceId;
    private String serviceName;
    private LocalDateTime scheduledDate;
    private Integer durationMinutes;
    private java.math.BigDecimal cost;
    private String clinic;
    private AppointmentStatus status;
    private String notes;
}
