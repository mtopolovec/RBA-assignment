package com.RBA_assignment.RBA_assignment.controller;

import com.RBA_assignment.RBA_assignment.dto.ClientDTO;
import com.RBA_assignment.RBA_assignment.kafka.CardStatusProducer;
import com.RBA_assignment.RBA_assignment.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/card-request")
public class NewCardRequestController {
    private final CardService cardService;
    private final CardStatusProducer cardStatusProducer;

    @PostMapping
    public ResponseEntity<?> newCardRequest(@RequestBody @Valid ClientDTO newCardRequest) {
        log.info("Received new card request: {}", newCardRequest);
        cardService.createCardNewRequest(newCardRequest);
        return ResponseEntity.status(201).build();
    }
}
