package com.jennydentista.service;

import com.jennydentista.entity.Appointment;
import com.jennydentista.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentReminderScheduler {

    private final AppointmentRepository appointmentRepository;
    private final WhatsAppService whatsAppService;

    // Ejecutar cada 5 minutos
    @Scheduled(cron = "0 */5 * * * *")
    @Transactional
    public void sendUpcomingAppointmentReminders() {
        LocalDateTime now = LocalDateTime.now();
        // Buscamos citas que ocurran dentro de los próximos 55 a 65 minutos
        // (aproximadamente "dentro de 1 hora")
        LocalDateTime start = now.plusMinutes(55);
        LocalDateTime end = now.plusMinutes(65);

        List<Appointment> upcomingAppointments = appointmentRepository.findUpcomingAppointmentsForReminder(start, end);

        if (upcomingAppointments.isEmpty()) {
            return;
        }

        log.info("Found {} upcoming appointments to send reminders.", upcomingAppointments.size());

        for (Appointment appointment : upcomingAppointments) {
            String patientPhone = appointment.getPatient().getPhone();
            if (patientPhone == null || patientPhone.trim().isEmpty()) {
                log.warn("Cannot send reminder for appointment {}: patient has no phone number.", appointment.getId());
                continue;
            }

            String timeFormatted = appointment.getScheduledDate().format(DateTimeFormatter.ofPattern("HH:mm"));
            String clinicName = appointment.getClinic() != null && !appointment.getClinic().isEmpty() ? appointment.getClinic() : "nuestro consultorio";
            
            String message = String.format(
                    "Hola %s, te recordamos tu cita hoy a las %s para el servicio de %s. Costo aproximado: $%s. Te esperamos en %s.",
                    appointment.getPatient().getName(),
                    timeFormatted,
                    appointment.getService().getName(),
                    appointment.getCost() != null ? appointment.getCost().toString() : appointment.getService().getBasePrice().toString(),
                    clinicName
            );

            boolean success = whatsAppService.sendMessage(patientPhone, message);

            if (success) {
                appointment.setReminderSent(true);
                appointmentRepository.save(appointment);
                log.info("Reminder sent successfully for appointment {}", appointment.getId());
            } else {
                log.error("Failed to send reminder for appointment {}", appointment.getId());
            }
        }
    }
}
