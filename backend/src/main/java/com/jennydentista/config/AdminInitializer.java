package com.jennydentista.config;

import com.jennydentista.entity.AdminUser;
import com.jennydentista.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminUserRepository.findByUsername("admin").isEmpty()) {
            AdminUser admin = AdminUser.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("jenny123")) // Default password
                    .role("ROLE_ADMIN")
                    .build();
            adminUserRepository.save(admin);
            System.out.println("Default admin user created: admin / jenny123");
        }
    }
}
