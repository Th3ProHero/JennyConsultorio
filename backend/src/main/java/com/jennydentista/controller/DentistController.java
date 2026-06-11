package com.jennydentista.controller;

import com.jennydentista.dto.DentistDTO;
import com.jennydentista.service.DentistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dentists")
@RequiredArgsConstructor
public class DentistController {

    private final DentistService dentistService;

    @GetMapping
    public ResponseEntity<List<DentistDTO>> findAll() {
        return ResponseEntity.ok(dentistService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DentistDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(dentistService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DentistDTO> create(@RequestBody DentistDTO dto) {
        return ResponseEntity.ok(dentistService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DentistDTO> update(@PathVariable Long id, @RequestBody DentistDTO dto) {
        return ResponseEntity.ok(dentistService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dentistService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
