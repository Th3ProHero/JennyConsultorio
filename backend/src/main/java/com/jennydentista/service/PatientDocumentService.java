package com.jennydentista.service;

import com.jennydentista.dto.PatientDocumentDTO;
import com.jennydentista.entity.DocumentTag;
import com.jennydentista.entity.Patient;
import com.jennydentista.entity.PatientDocument;
import com.jennydentista.exception.DocumentValidationException;
import com.jennydentista.repository.PatientDocumentRepository;
import com.jennydentista.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PatientDocumentService {

    private final PatientDocumentRepository documentRepository;
    private final PatientRepository patientRepository;

    private static final long MAX_FILE_SIZE = 15L * 1024 * 1024; // 15 MB
    private static final int MAX_DOCUMENTS_PER_PATIENT = 6;
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp",
            "application/pdf"
    );

    /**
     * Upload a document for a patient. Validates file type, size, and document count.
     * Stores the raw binary data directly in PostgreSQL.
     */
    public PatientDocumentDTO uploadDocument(Long patientId, MultipartFile file, String tagStr) throws IOException {
        // 1. Validate patient exists
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + patientId));

        // 2. Validate document count (RULE: max 6 per patient)
        long count = documentRepository.countByPatientId(patientId);
        if (count >= MAX_DOCUMENTS_PER_PATIENT) {
            throw new DocumentValidationException(
                    "Límite de " + MAX_DOCUMENTS_PER_PATIENT + " archivos alcanzado para este paciente.");
        }

        // 3. Validate file size (RULE: max 15 MB)
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new DocumentValidationException("El archivo excede el límite de 15 MB.");
        }

        // 4. Validate file type (RULE: only images and PDFs)
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new DocumentValidationException(
                    "Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, GIF, WebP, BMP) y PDF.");
        }

        // 5. Parse tag
        DocumentTag tag;
        try {
            tag = DocumentTag.valueOf(tagStr);
        } catch (IllegalArgumentException e) {
            throw new DocumentValidationException("Etiqueta de documento inválida: " + tagStr);
        }

        // 6. Build and save document entity
        PatientDocument doc = PatientDocument.builder()
                .name(file.getOriginalFilename())
                .type(contentType)
                .data("") // Default empty string to avoid "not-null constraint" on legacy databases
                .mimeType(contentType)
                .fileData(file.getBytes())
                .tag(tag)
                .patient(patient)
                .build();

        doc = documentRepository.save(doc);
        return toDTO(doc);
    }

    /**
     * List all documents for a patient, ordered by date descending (newest first).
     * Returns metadata only — no binary data in the response.
     */
    public List<PatientDocumentDTO> getDocumentsByPatientId(Long patientId) {
        return documentRepository.findByPatientIdOrderByDateDesc(patientId).stream()
                .map(this::toDTO)
                .toList();
    }

    /**
     * Get the raw document entity (including binary data) for serving files.
     */
    public PatientDocument getDocumentEntity(Long docId) {
        return documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado con ID: " + docId));
    }

    /**
     * Delete a document permanently.
     */
    public void deleteDocument(Long docId) {
        if (!documentRepository.existsById(docId)) {
            throw new RuntimeException("Documento no encontrado con ID: " + docId);
        }
        documentRepository.deleteById(docId);
    }

    /**
     * Get the current document count for a patient.
     */
    public long countByPatientId(Long patientId) {
        return documentRepository.countByPatientId(patientId);
    }

    /**
     * Maps entity to DTO with computed fileUrl.
     * Intentionally excludes binary data (fileData/data) to keep responses lightweight.
     */
    private PatientDocumentDTO toDTO(PatientDocument doc) {
        String effectiveMimeType = doc.getMimeType() != null ? doc.getMimeType() : doc.getType();
        String fileUrl = "/api/admin/documents/" + doc.getId() + "/file";

        return PatientDocumentDTO.builder()
                .id(doc.getId())
                .name(doc.getName())
                .mimeType(effectiveMimeType)
                .tag(doc.getTag() != null ? doc.getTag().name() : "OTROS")
                .fileUrl(fileUrl)
                .date(doc.getDate())
                .build();
    }
}
