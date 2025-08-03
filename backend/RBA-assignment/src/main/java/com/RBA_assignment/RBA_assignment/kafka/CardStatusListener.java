package com.RBA_assignment.RBA_assignment.kafka;

import com.RBA_assignment.RBA_assignment.dto.CardStatusMessage;
import com.RBA_assignment.RBA_assignment.service.CardService;
import com.RBA_assignment.RBA_assignment.service.ClientService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CardStatusListener {

    private final CardService cardService;
    private final ClientService clientService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "card-status", groupId = "card-status-group")
    public void listenCardStatus(String message) {
        log.info("Received card status update: {}", message);
        try {
            CardStatusMessage statusMessage = objectMapper.readValue(message, CardStatusMessage.class);
            log.info("Received status update: {}", statusMessage);
            // Add the trigger for message processing maybe api endpoint that will send the msg here like change of card status!
            cardService.eventChangeCardStatus(statusMessage.getOib(), statusMessage.getStatus().toString());
            clientService.eventChangeClientStatus(statusMessage.getOib(), statusMessage.getStatus().toString());
        } catch (Exception e) {
            log.error("Failed to process card status message: {}", message, e);
        }
    }
}
