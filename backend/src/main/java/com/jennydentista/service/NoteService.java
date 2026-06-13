package com.jennydentista.service;

import com.jennydentista.dto.NoteDTO;
import com.jennydentista.entity.Note;
import com.jennydentista.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;

    public List<NoteDTO> findAll() {
        return noteRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(this::toDTO)
                .toList();
    }

    public NoteDTO create(NoteDTO dto) {
        Note note = Note.builder()
                .text(dto.getText())
                .category(dto.getCategory())
                .color(dto.getColor())
                .isCompleted(dto.getIsCompleted() != null ? dto.getIsCompleted() : false)
                .build();
        return toDTO(noteRepository.save(note));
    }

    public NoteDTO update(Long id, NoteDTO dto) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada: " + id));
        if (dto.getText() != null) note.setText(dto.getText());
        if (dto.getCategory() != null) note.setCategory(dto.getCategory());
        if (dto.getColor() != null) note.setColor(dto.getColor());
        if (dto.getIsCompleted() != null) note.setIsCompleted(dto.getIsCompleted());
        return toDTO(noteRepository.save(note));
    }

    public void delete(Long id) {
        noteRepository.deleteById(id);
    }

    private NoteDTO toDTO(Note n) {
        return NoteDTO.builder()
                .id(n.getId())
                .text(n.getText())
                .category(n.getCategory())
                .color(n.getColor())
                .isCompleted(n.getIsCompleted())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
