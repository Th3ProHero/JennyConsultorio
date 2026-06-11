package com.jennydentista.service;

import com.jennydentista.dto.DentistDTO;
import com.jennydentista.entity.Dentist;
import com.jennydentista.repository.DentistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DentistService {

    private final DentistRepository dentistRepository;

    public List<DentistDTO> findAll() {
        return dentistRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public DentistDTO findById(Long id) {
        Dentist dentist = dentistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dentista no encontrado con ID: " + id));
        return toDTO(dentist);
    }

    public DentistDTO create(DentistDTO dto) {
        Dentist dentist = Dentist.builder()
                .name(dto.getName())
                .specialty(dto.getSpecialty())
                .phone(dto.getPhone())
                .build();
        return toDTO(dentistRepository.save(dentist));
    }

    public DentistDTO update(Long id, DentistDTO dto) {
        Dentist dentist = dentistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dentista no encontrado con ID: " + id));
        dentist.setName(dto.getName());
        dentist.setSpecialty(dto.getSpecialty());
        dentist.setPhone(dto.getPhone());
        return toDTO(dentistRepository.save(dentist));
    }

    public void delete(Long id) {
        dentistRepository.deleteById(id);
    }

    private DentistDTO toDTO(Dentist d) {
        return DentistDTO.builder()
                .id(d.getId())
                .name(d.getName())
                .specialty(d.getSpecialty())
                .phone(d.getPhone())
                .build();
    }
}
