package com.RBA_assignment.RBA_assignment.mapper;

import com.RBA_assignment.RBA_assignment.dto.CardDTO;
import com.RBA_assignment.RBA_assignment.model.Card;

public class CardMapper {
    public static CardDTO cardToDto(Card card) {
        if (card == null) {
            return null;
        }
        return new CardDTO(
                card.getCardNumber(),
                card.getOib(),
                card.getStatus().toString()
        );
    }

    public static Card dtoToCard(CardDTO cardDTO) {
        if (cardDTO == null) {
            return null;
        }
        return Card.builder()
                .cardNumber(cardDTO.getCardNumber())
                .oib(cardDTO.getOib())
                .status(cardDTO.getStatus())
                .build();
    }
}
