package com.jennydentista.service;

import com.jennydentista.dto.ServiceDTO;
import com.jennydentista.entity.Service;
import com.jennydentista.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public List<ServiceDTO> findAll() {
        return serviceRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public ServiceDTO findById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));
        return toDTO(service);
    }

    public ServiceDTO create(ServiceDTO dto) {
        Service service = Service.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .basePrice(dto.getBasePrice())
                .originalPrice(dto.getOriginalPrice())
                .isPromotion(dto.getIsPromotion() != null ? dto.getIsPromotion() : false)
                .build();
        return toDTO(serviceRepository.save(service));
    }

    public ServiceDTO update(Long id, ServiceDTO dto) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));
        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setBasePrice(dto.getBasePrice());
        service.setOriginalPrice(dto.getOriginalPrice());
        if (dto.getIsPromotion() != null) {
            service.setIsPromotion(dto.getIsPromotion());
        }
        return toDTO(serviceRepository.save(service));
    }

    public void delete(Long id) {
        serviceRepository.deleteById(id);
    }

    private ServiceDTO toDTO(Service s) {
        return ServiceDTO.builder()
                .id(s.getId())
                .name(s.getName())
                .description(s.getDescription())
                .basePrice(s.getBasePrice())
                .originalPrice(s.getOriginalPrice())
                .isPromotion(s.getIsPromotion())
                .build();
    }
}
