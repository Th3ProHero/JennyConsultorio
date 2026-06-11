package com.jennydentista.controller;

import com.jennydentista.dto.DentistDTO;
import com.jennydentista.dto.ServiceDTO;
import com.jennydentista.service.DentistService;
import com.jennydentista.service.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ServiceService serviceService;
    private final DentistService dentistService;

    @GetMapping("/services")
    public ResponseEntity<List<ServiceDTO>> getServices() {
        return ResponseEntity.ok(serviceService.findAll());
    }

    @GetMapping("/dentists")
    public ResponseEntity<List<DentistDTO>> getDentists() {
        return ResponseEntity.ok(dentistService.findAll());
    }
}
