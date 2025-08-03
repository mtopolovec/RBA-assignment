package com.RBA_assignment.RBA_assignment.service;

import com.RBA_assignment.RBA_assignment.dto.CardDTO;
import com.RBA_assignment.RBA_assignment.dto.ClientDTO;

import java.util.List;

public interface CardService {
    void createCardNewRequest(ClientDTO newCardRequest);
    CardDTO createCard(CardDTO cardDTO);
    CardDTO getCardByCardNumber(String cardNumber);
    List<CardDTO> getAllCards();
    CardDTO updateCard(CardDTO cardDTO);
    CardDTO deleteCard(String cardNumber);
    void eventChangeCardStatus(String oib, String status);
}
