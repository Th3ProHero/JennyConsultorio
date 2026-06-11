package com.jennydentista.service;

import com.jennydentista.dto.AppointmentDTO;
import com.jennydentista.entity.*;
import com.jennydentista.repository.*;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DentistRepository dentistRepository;
    private final ServiceRepository serviceRepository;

    public List<AppointmentDTO> findAll() {
        return appointmentRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public AppointmentDTO findById(Long id) {
        Appointment a = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con ID: " + id));
        return toDTO(a);
    }

    public List<AppointmentDTO> findByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(23, 59, 59);
        return appointmentRepository.findByScheduledDateBetweenOrderByScheduledDateAsc(start, end)
                .stream().map(this::toDTO).toList();
    }

    public List<AppointmentDTO> findByDentistAndDate(Long dentistId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(23, 59, 59);
        return appointmentRepository
                .findByDentistIdAndScheduledDateBetweenOrderByScheduledDateAsc(dentistId, start, end)
                .stream().map(this::toDTO).toList();
    }

    public List<AppointmentDTO> findByPatient(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByScheduledDateDesc(patientId)
                .stream().map(this::toDTO).toList();
    }

    public AppointmentDTO create(AppointmentDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        Dentist dentist = dentistRepository.findById(dto.getDentistId())
                .orElseThrow(() -> new RuntimeException("Dentista no encontrado"));
        Service service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .dentist(dentist)
                .service(service)
                .scheduledDate(dto.getScheduledDate())
                .durationMinutes(dto.getDurationMinutes() != null ? dto.getDurationMinutes() : 30)
                .cost(dto.getCost() != null ? dto.getCost() : service.getBasePrice())
                .clinic(dto.getClinic())
                .status(dto.getStatus() != null ? dto.getStatus() : AppointmentStatus.PENDING)
                .notes(dto.getNotes())
                .build();
        return toDTO(appointmentRepository.save(appointment));
    }

    public AppointmentDTO update(Long id, AppointmentDTO dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con ID: " + id));

        if (dto.getPatientId() != null) {
            appointment.setPatient(patientRepository.findById(dto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Paciente no encontrado")));
        }
        if (dto.getDentistId() != null) {
            appointment.setDentist(dentistRepository.findById(dto.getDentistId())
                    .orElseThrow(() -> new RuntimeException("Dentista no encontrado")));
        }
        if (dto.getServiceId() != null) {
            appointment.setService(serviceRepository.findById(dto.getServiceId())
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado")));
        }
        if (dto.getScheduledDate() != null) {
            appointment.setScheduledDate(dto.getScheduledDate());
        }
        appointment.setDurationMinutes(dto.getDurationMinutes() != null ? dto.getDurationMinutes() : 30);
        appointment.setCost(dto.getCost());
        appointment.setClinic(dto.getClinic());

        if (dto.getStatus() != null) {
            appointment.setStatus(dto.getStatus());
        }
        appointment.setNotes(dto.getNotes());

        return toDTO(appointmentRepository.save(appointment));
    }

    public void delete(Long id) {
        appointmentRepository.deleteById(id);
    }

    private AppointmentDTO toDTO(Appointment a) {
        return AppointmentDTO.builder()
                .id(a.getId())
                .patientId(a.getPatient().getId())
                .patientName(a.getPatient().getName())
                .dentistId(a.getDentist().getId())
                .dentistName(a.getDentist().getName())
                .serviceId(a.getService().getId())
                .serviceName(a.getService().getName())
                .scheduledDate(a.getScheduledDate())
                .durationMinutes(a.getDurationMinutes())
                .cost(a.getCost())
                .clinic(a.getClinic())
                .status(a.getStatus())
                .notes(a.getNotes())
                .build();
    }
}
