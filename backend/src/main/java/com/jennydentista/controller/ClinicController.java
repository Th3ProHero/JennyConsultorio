package com.jennydentista.controller;

import com.jennydentista.dto.ClinicDTO;
import com.jennydentista.service.ClinicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ClinicController {

    private final ClinicService clinicService;

    // ── Public endpoint ──────────────────────────────────────
    @GetMapping("/api/public/clinics")
    public ResponseEntity<List<ClinicDTO>> getPublicClinics() {
        return ResponseEntity.ok(clinicService.findAll());
    }

    // ── Admin endpoints ───────────────────────────────────────
    @GetMapping("/api/admin/clinics")
    public ResponseEntity<List<ClinicDTO>> findAll() {
        return ResponseEntity.ok(clinicService.findAll());
    }

    @GetMapping("/api/admin/clinics/{id}")
    public ResponseEntity<ClinicDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(clinicService.findById(id));
    }

    @PostMapping("/api/admin/clinics")
    public ResponseEntity<ClinicDTO> create(@RequestBody ClinicDTO dto) {
        return ResponseEntity.ok(clinicService.create(dto));
    }

    @PutMapping("/api/admin/clinics/{id}")
    public ResponseEntity<ClinicDTO> update(@PathVariable Long id, @RequestBody ClinicDTO dto) {
        return ResponseEntity.ok(clinicService.update(id, dto));
    }

    @DeleteMapping("/api/admin/clinics/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clinicService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
