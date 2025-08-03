package com.RBA_assignment.RBA_assignment.controller;

import com.RBA_assignment.RBA_assignment.dto.CardDTO;
import com.RBA_assignment.RBA_assignment.service.CardService;
import com.RBA_assignment.RBA_assignment.validator.ValidOIB;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CrossOrigin
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/cards")
public class CardController {
    private final CardService cardService;

    @PostMapping
    public ResponseEntity<CardDTO> createCard(@RequestBody @Valid CardDTO cardDTO) {
        log.info("Creating card for client: {}", cardDTO);

        return ResponseEntity.ok(cardService.createCard(cardDTO));
    }

    @GetMapping("/{cardNumber}")
    public ResponseEntity<CardDTO> getCardByNumber(
            @PathVariable
            @Pattern(
                    regexp = "^[1-9][0-9]{15}$",
                    message = "Card number must be 16 digits, start with a digit greater than 0, and contain only numbers."
            ) String cardNumber
    ) {
        log.info("Fetching cards by card number: {}", cardNumber);
        CardDTO card = cardService.getCardByCardNumber(cardNumber);
        return ResponseEntity.ok(card);
    }

    @GetMapping("/client/{oib}")
    public ResponseEntity<CardDTO> getCardByOib(@PathVariable @ValidOIB String oib) {
        log.info("Fetching cards by card number: {}", oib);
        CardDTO card = cardService.getCardByOib(oib);
        return ResponseEntity.ok(card);
    }

    @GetMapping
    public ResponseEntity<List<CardDTO>> getAllCards() {
        log.info("Fetching all cards");
        List<CardDTO> cards = cardService.getAllCards();
        return ResponseEntity.ok(cards);
    }

    @PutMapping
    public ResponseEntity<CardDTO> updateCard(@RequestBody @Valid CardDTO cardUpdateRequest) {
        log.info("Updating card: {}", cardUpdateRequest);
        CardDTO updatedCard = cardService.updateCard(cardUpdateRequest);
        return ResponseEntity.ok(updatedCard);
    }

    @DeleteMapping("/{cardNumber}")
    public ResponseEntity<CardDTO> deleteCard(
            @PathVariable
            @Pattern(
                    regexp = "^[1-9][0-9]{15}$",
                    message = "Card number must be 16 digits, start with a digit greater than 0, and contain only numbers."
            ) String cardNumber
    ) {
        log.info("Deleting client with card number: {}", cardNumber);
        return ResponseEntity.ok(cardService.deleteCard(cardNumber));
    }
}
