package com.RBA_assignment.RBA_assignment.service;

import com.RBA_assignment.RBA_assignment.dto.CardDTO;
import com.RBA_assignment.RBA_assignment.dto.ClientDTO;
import com.RBA_assignment.RBA_assignment.mapper.CardMapper;
import com.RBA_assignment.RBA_assignment.model.Card;
import com.RBA_assignment.RBA_assignment.model.Status;
import com.RBA_assignment.RBA_assignment.repository.CardRepository;
import com.RBA_assignment.RBA_assignment.utils.CardNumberGenerator;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.FetchNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;

    private void logCardNotFound(String cardNumber) {
        log.error("Card not found with number: {}", cardNumber);
    }

    private CardDTO createCardInternal(String cardNumber, String oib, Status status) {
        log.info("Attempting to create card with number: {}", cardNumber);
        if (cardRepository.findByCardNumber(cardNumber).isPresent()) {
            log.error("Card already exists with number: {}", cardNumber);
            throw new EntityExistsException("Card already exists with number: " + cardNumber);
        }
        Card card = Card.builder()
                .cardNumber(cardNumber)
                .oib(oib)
                .status(status)
                .build();
        log.info("Card created successfully: {}", card);
        return CardMapper.cardToDto(cardRepository.save(card));
    }

    @Override
    public void createCardNewRequest(ClientDTO newCardRequest) {
        String cardNumber = CardNumberGenerator.generate();
        createCardInternal(cardNumber, newCardRequest.getOib(), newCardRequest.getStatus());
    }

    @Override
    public CardDTO createCard(CardDTO cardDTO) {
        return createCardInternal(cardDTO.getCardNumber(), cardDTO.getOib(), cardDTO.getStatus());
    }

    @Override
    public CardDTO getCardByCardNumber(String cardNumber) {
        log.info("Fetching card with number: {}", cardNumber);
        return CardMapper.cardToDto(cardRepository.findByCardNumber(cardNumber)
                .orElseThrow(() -> {
                    logCardNotFound(cardNumber);
                    return new FetchNotFoundException("Card not found with number: " + cardNumber, cardNumber);
                }));
    }

    @Override
    public List<CardDTO> getAllCards() {
        log.info("Fetching all cards");
        return cardRepository.findAll().stream().map(CardMapper::cardToDto).toList();
    }

    @Override
    public CardDTO updateCard(CardDTO cardDTO) {
        Card card = cardRepository.findByCardNumber(cardDTO.getCardNumber())
                .orElseThrow(() -> {
                    logCardNotFound(cardDTO.getCardNumber());
                    return new FetchNotFoundException("Card not found with number: " + cardDTO.getCardNumber(), cardDTO.getCardNumber());
                });
        return CardMapper.cardToDto(cardRepository.save(card));
    }

    @Override
    public CardDTO deleteCard(String cardNumber) {
        Card card = cardRepository.findByCardNumber(cardNumber)
                .orElseThrow(() -> new FetchNotFoundException("Card not found with number: " + cardNumber, cardNumber));
        cardRepository.deleteById(card.getId());
        log.info("Card deleted: {}", card);
        return CardMapper.cardToDto(card);
    }

    @Override
    public void eventChangeCardStatus(String oib, String status) {
        log.info("Changing card status for OIB: {} to status: {}", oib, status);
        Card card = cardRepository.findByOib(oib)
                .orElseThrow(() -> new FetchNotFoundException("Card not found for OIB: " + oib, oib));

        Status newStatus = Status.valueOf(status.toUpperCase());
        card.setStatus(newStatus);
        cardRepository.save(card);
        log.info("Card status changed successfully: {}", status);
    }
}
