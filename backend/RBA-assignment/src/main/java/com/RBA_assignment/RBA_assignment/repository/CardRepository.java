package com.RBA_assignment.RBA_assignment.repository;

import com.RBA_assignment.RBA_assignment.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findByCardNumber(String cardNumber);
    Optional<Card> findByOib(String oib);
}
