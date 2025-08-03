package com.RBA_assignment.RBA_assignment.kafka;

import com.RBA_assignment.RBA_assignment.dto.CardStatusMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CardStatusProducer {
    private final KafkaTemplate<String, CardStatusMessage> kafkaTemplate;

    public void sendCardStatus(CardStatusMessage message) {
        kafkaTemplate.send("card-status", message);
    }
}