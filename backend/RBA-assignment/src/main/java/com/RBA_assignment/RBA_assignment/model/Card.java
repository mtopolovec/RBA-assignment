package com.RBA_assignment.RBA_assignment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Builder
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String cardNumber;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(unique = true, nullable = false, length = 11)
    private String oib;
}
