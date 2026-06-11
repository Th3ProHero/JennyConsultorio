package com.jennydentista.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardDTO {
    private BigDecimal monthlyRevenue;
    private long todayAppointments;
    private long totalPatients;
    private long pendingAppointments;
    private List<Map<String, Object>> topServices;
    private List<AppointmentDTO> todaySchedule;
}
