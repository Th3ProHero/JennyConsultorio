package com.jennydentista.controller;

import com.jennydentista.dto.NoteDTO;
import com.jennydentista.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<List<NoteDTO>> findAll() {
        return ResponseEntity.ok(noteService.findAll());
    }

    @PostMapping
    public ResponseEntity<NoteDTO> create(@RequestBody NoteDTO dto) {
        return ResponseEntity.ok(noteService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteDTO> update(@PathVariable Long id, @RequestBody NoteDTO dto) {
        return ResponseEntity.ok(noteService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
