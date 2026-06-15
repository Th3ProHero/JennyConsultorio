package com.jennydentista.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class WhatsAppService {

    @Value("${openwa.api.url:http://openwa-api:2785/api}")
    private String openwaApiUrl;

    @Value("${openwa.api.key:}")
    private String openwaApiKey;

    @Value("${openwa.session.name:default}")
    private String sessionName;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendMessage(String phoneNumber, String text) {
        try {
            // OpenWA format requires country code without '+' and ending with @c.us for regular chats
            String cleanPhone = phoneNumber.replaceAll("[^0-9]", "");
            String chatId = cleanPhone + "@c.us";

            String url = openwaApiUrl + "/sessions/" + sessionName + "/messages/send-text";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (openwaApiKey != null && !openwaApiKey.isEmpty()) {
                headers.set("X-API-Key", openwaApiKey);
            }

            Map<String, Object> body = new HashMap<>();
            body.put("chatId", chatId);
            body.put("text", text);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            restTemplate.postForEntity(url, request, String.class);
            log.info("WhatsApp message sent successfully to {}", cleanPhone);
            return true;
        } catch (Exception e) {
            log.error("Failed to send WhatsApp message to {}", phoneNumber, e);
            return false;
        }
    }
}
