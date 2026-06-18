package com.jennydentista.controller;

import com.jennydentista.dto.PatientDocumentDTO;
import com.jennydentista.entity.PatientDocument;
import com.jennydentista.service.PatientDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class PatientDocumentController {

    private final PatientDocumentService documentService;

    /**
     * Upload a document for a patient.
     * Accepts multipart/form-data with fields: file (binary), tag (string).
     */
    @PostMapping("/patients/{patientId}/documents")
    public ResponseEntity<PatientDocumentDTO> upload(
            @PathVariable Long patientId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("tag") String tag) throws IOException {
        PatientDocumentDTO doc = documentService.uploadDocument(patientId, file, tag);
        return ResponseEntity.ok(doc);
    }

    /**
     * List all documents for a patient (metadata only, no binary data).
     * Ordered by creation date descending.
     */
    @GetMapping("/patients/{patientId}/documents")
    public ResponseEntity<List<PatientDocumentDTO>> list(@PathVariable Long patientId) {
        return ResponseEntity.ok(documentService.getDocumentsByPatientId(patientId));
    }

    /**
     * Serve a document's binary content with correct Content-Type headers.
     * Supports both new-style (fileData bytes) and legacy (Base64 data URL) documents.
     * This is the "Route Handler" — the frontend uses this URL to render images.
     */
    @GetMapping("/documents/{docId}/file")
    public ResponseEntity<byte[]> serve(@PathVariable Long docId) {
        PatientDocument doc = documentService.getDocumentEntity(docId);

        byte[] content;
        String contentType;

        if (doc.getFileData() != null) {
            // New-style: raw binary stored in PostgreSQL BYTEA column
            content = doc.getFileData();
            contentType = doc.getMimeType() != null ? doc.getMimeType() : "application/octet-stream";
        } else if (doc.getData() != null) {
            // Legacy: Base64 Data URL stored as TEXT string
            String dataUrl = doc.getData();
            if (dataUrl.contains(",")) {
                String[] parts = dataUrl.split(",", 2);
                String meta = parts[0]; // e.g. "data:image/jpeg;base64"
                contentType = meta.replaceAll("data:", "").replaceAll(";base64", "");
                content = Base64.getDecoder().decode(parts[1]);
            } else {
                content = Base64.getDecoder().decode(dataUrl);
                contentType = doc.getType() != null ? doc.getType() : "application/octet-stream";
            }
        } else {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentLength(content.length);
        headers.setCacheControl(CacheControl.maxAge(java.time.Duration.ofDays(30)).cachePublic());
        headers.setContentDisposition(ContentDisposition.inline()
                .filename(doc.getName() != null ? doc.getName() : "document")
                .build());

        return new ResponseEntity<>(content, headers, HttpStatus.OK);
    }

    /**
     * Delete a document permanently.
     */
    @DeleteMapping("/documents/{docId}")
    public ResponseEntity<Void> delete(@PathVariable Long docId) {
        documentService.deleteDocument(docId);
        return ResponseEntity.noContent().build();
    }
}
