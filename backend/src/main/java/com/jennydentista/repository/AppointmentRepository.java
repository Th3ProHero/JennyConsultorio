package com.jennydentista.repository;

import com.jennydentista.entity.Appointment;
import com.jennydentista.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDentistIdAndScheduledDateBetweenOrderByScheduledDateAsc(
            Long dentistId, LocalDateTime start, LocalDateTime end);

    List<Appointment> findByScheduledDateBetweenOrderByScheduledDateAsc(
            LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.scheduledDate BETWEEN :start AND :end")
    long countByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.scheduledDate BETWEEN :start AND :end AND a.status = :status")
    long countByDateRangeAndStatus(@Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end,
                                    @Param("status") AppointmentStatus status);

    @Query("SELECT COALESCE(SUM(s.basePrice), 0) FROM Appointment a JOIN a.service s " +
           "WHERE a.status = 'COMPLETED' AND a.scheduledDate BETWEEN :start AND :end")
    BigDecimal calculateRevenueByDateRange(@Param("start") LocalDateTime start,
                                           @Param("end") LocalDateTime end);

    @Query("SELECT s.name, COUNT(a) FROM Appointment a JOIN a.service s " +
           "WHERE a.scheduledDate BETWEEN :start AND :end " +
           "GROUP BY s.name ORDER BY COUNT(a) DESC")
    List<Object[]> findTopServicesByDateRange(@Param("start") LocalDateTime start,
                                              @Param("end") LocalDateTime end);

    List<Appointment> findByPatientIdOrderByScheduledDateDesc(Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.scheduledDate BETWEEN :start AND :end AND a.reminderSent = false AND (a.status = 'PENDING' OR a.status = 'CONFIRMED')")
    List<Appointment> findUpcomingAppointmentsForReminder(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
