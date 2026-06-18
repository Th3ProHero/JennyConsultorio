package com.jennydentista.repository;

import com.jennydentista.entity.PatientDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientDocumentRepository extends JpaRepository<PatientDocument, Long> {
    List<PatientDocument> findByPatientIdOrderByDateDesc(Long patientId);
    long countByPatientId(Long patientId);
}
