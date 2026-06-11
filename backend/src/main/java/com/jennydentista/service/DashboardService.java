package com.jennydentista.service;

import com.jennydentista.dto.AppointmentDTO;
import com.jennydentista.dto.DashboardDTO;
import com.jennydentista.repository.AppointmentRepository;
import com.jennydentista.repository.PatientRepository;
import com.jennydentista.entity.AppointmentStatus;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class DashboardService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final AppointmentService appointmentService;

    public DashboardDTO getDashboardData() {
        LocalDate today = LocalDate.now();
        LocalDateTime monthStart = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime monthEnd = today.atTime(23, 59, 59);
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = today.atTime(23, 59, 59);

        // Monthly revenue
        BigDecimal monthlyRevenue = appointmentRepository.calculateRevenueByDateRange(monthStart, monthEnd);

        // Today's appointments count
        long todayAppointments = appointmentRepository.countByDateRange(todayStart, todayEnd);

        // Total patients
        long totalPatients = patientRepository.count();

        // Pending appointments
        long pendingAppointments = appointmentRepository.countByDateRangeAndStatus(
                todayStart, todayEnd, AppointmentStatus.PENDING);

        // Top 3 services this month
        List<Object[]> topServicesRaw = appointmentRepository.findTopServicesByDateRange(monthStart, monthEnd);
        List<Map<String, Object>> topServices = new ArrayList<>();
        int limit = Math.min(topServicesRaw.size(), 3);
        for (int i = 0; i < limit; i++) {
            Object[] row = topServicesRaw.get(i);
            Map<String, Object> entry = new HashMap<>();
            entry.put("name", row[0]);
            entry.put("count", row[1]);
            topServices.add(entry);
        }

        // Today's schedule
        List<AppointmentDTO> todaySchedule = appointmentService.findByDate(today);

        return DashboardDTO.builder()
                .monthlyRevenue(monthlyRevenue)
                .todayAppointments(todayAppointments)
                .totalPatients(totalPatients)
                .pendingAppointments(pendingAppointments)
                .topServices(topServices)
                .todaySchedule(todaySchedule)
                .build();
    }
}
