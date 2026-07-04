package com.jennydentista.service;

import com.jennydentista.dto.ClinicDTO;
import com.jennydentista.entity.Clinic;
import com.jennydentista.repository.ClinicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClinicService {

    private final ClinicRepository clinicRepository;

    public List<ClinicDTO> findAll() {
        return clinicRepository.findAllByOrderBySortOrderAscIdAsc().stream()
                .map(this::toDTO)
                .toList();
    }

    public ClinicDTO findById(Long id) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultorio no encontrado con ID: " + id));
        return toDTO(clinic);
    }

    public ClinicDTO create(ClinicDTO dto) {
        Clinic clinic = Clinic.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .hours(dto.getHours())
                .mapUrl(dto.getMapUrl())
                .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
                .build();
        return toDTO(clinicRepository.save(clinic));
    }

    public ClinicDTO update(Long id, ClinicDTO dto) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultorio no encontrado con ID: " + id));
        clinic.setName(dto.getName());
        clinic.setAddress(dto.getAddress());
        clinic.setHours(dto.getHours());
        clinic.setMapUrl(dto.getMapUrl());
        if (dto.getSortOrder() != null) clinic.setSortOrder(dto.getSortOrder());
        return toDTO(clinicRepository.save(clinic));
    }

    public void delete(Long id) {
        clinicRepository.deleteById(id);
    }

    private ClinicDTO toDTO(Clinic c) {
        return ClinicDTO.builder()
                .id(c.getId())
                .name(c.getName())
                .address(c.getAddress())
                .hours(c.getHours())
                .mapUrl(c.getMapUrl())
                .sortOrder(c.getSortOrder())
                .build();
    }
}
