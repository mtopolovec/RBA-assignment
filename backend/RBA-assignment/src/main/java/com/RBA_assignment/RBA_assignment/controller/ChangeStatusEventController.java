package com.RBA_assignment.RBA_assignment.controller;

import com.RBA_assignment.RBA_assignment.dto.CardStatusMessage;
import com.RBA_assignment.RBA_assignment.kafka.CardStatusProducer;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@CrossOrigin
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/card-status")
public class ChangeStatusEventController {
    private final CardStatusProducer cardStatusProducer;

    @PostMapping
    public ResponseEntity<?> changeStatusRequest(@RequestBody @Valid CardStatusMessage newCardStatusRequest) {
        log.info("Received new card status request: {}", newCardStatusRequest);
        cardStatusProducer.sendCardStatus(newCardStatusRequest);
        return ResponseEntity.status(201).build();
    }
}
