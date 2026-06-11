package com.jennydentista.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private BigDecimal originalPrice;
    private Boolean isPromotion;
}
