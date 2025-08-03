package com.RBA_assignment.RBA_assignment.service;

import com.RBA_assignment.RBA_assignment.dto.CardStatusMessage;
import com.RBA_assignment.RBA_assignment.dto.ClientDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class CardRequestService {
    private final RestTemplate restTemplate;

    @Value("${card.request.url}")
    private String url;

    public void requestCardForClient(ClientDTO client) {
        try {
            restTemplate.postForObject(
                    url,
                    client,
                    CardStatusMessage.class
            );
        } catch (HttpServerErrorException.InternalServerError e) {
            log.warn("Card may already exist for client with OIB {} (received 500 from card service)", client.getOib());
        } catch (Exception e) {
            log.error("Unexpected error while requesting card: {}", e.getMessage());
        }
    }
}
