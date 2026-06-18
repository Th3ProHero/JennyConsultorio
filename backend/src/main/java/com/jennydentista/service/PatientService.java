package com.jennydentista.service;

import com.jennydentista.dto.PatientDTO;
import com.jennydentista.dto.PatientDocumentDTO;
import com.jennydentista.entity.Patient;
import com.jennydentista.entity.PatientDocument;
import com.jennydentista.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public List<PatientDTO> findAll() {
        return patientRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public PatientDTO findById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + id));
        return toDTO(patient);
    }

    public PatientDTO create(PatientDTO dto) {
        Patient patient = Patient.builder()
                .name(dto.getName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .insights(dto.getInsights())
                .allergies(dto.getAllergies())
                .isBlacklisted(dto.getIsBlacklisted() != null ? dto.getIsBlacklisted() : false)
                .documents(new ArrayList<>())
                .build();
                
        if (dto.getDocuments() != null) {
            for (PatientDocumentDTO docDto : dto.getDocuments()) {
                PatientDocument doc = PatientDocument.builder()
                        .name(docDto.getName())
                        .type(docDto.getType())
                        .data(docDto.getData())
                        .date(docDto.getDate())
                        .patient(patient)
                        .build();
                patient.getDocuments().add(doc);
            }
        }
        
        return toDTO(patientRepository.save(patient));
    }

    public PatientDTO update(Long id, PatientDTO dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + id));
        patient.setName(dto.getName());
        patient.setPhone(dto.getPhone());
        patient.setEmail(dto.getEmail());
        patient.setInsights(dto.getInsights());
        patient.setAllergies(dto.getAllergies());
        if (dto.getIsBlacklisted() != null) {
            patient.setIsBlacklisted(dto.getIsBlacklisted());
        }
        
        // Update documents
        if (dto.getDocuments() != null) {
            patient.getDocuments().clear();
            for (PatientDocumentDTO docDto : dto.getDocuments()) {
                PatientDocument doc = PatientDocument.builder()
                        .name(docDto.getName())
                        .type(docDto.getType())
                        .data(docDto.getData())
                        .date(docDto.getDate())
                        .patient(patient)
                        .build();
                patient.getDocuments().add(doc);
            }
        }
        
        return toDTO(patientRepository.save(patient));
    }

    public void delete(Long id) {
        patientRepository.deleteById(id);
    }

    public long count() {
        return patientRepository.count();
    }

    private PatientDTO toDTO(Patient p) {
        List<PatientDocumentDTO> docs = p.getDocuments() != null ? p.getDocuments().stream()
                .map(d -> PatientDocumentDTO.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .type(d.getType())
                        .mimeType(d.getMimeType() != null ? d.getMimeType() : d.getType())
                        .tag(d.getTag() != null ? d.getTag().name() : "OTROS")
                        .fileUrl("/api/admin/documents/" + d.getId() + "/file")
                        .date(d.getDate())
                        .build())
                .toList() : new ArrayList<>();
                
        return PatientDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .phone(p.getPhone())
                .email(p.getEmail())
                .insights(p.getInsights())
                .allergies(p.getAllergies())
                .isBlacklisted(p.getIsBlacklisted())
                .createdAt(p.getCreatedAt())
                .documents(docs)
                .build();
    }
}
