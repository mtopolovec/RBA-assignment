package com.RBA_assignment.RBA_assignment.repository;

import com.RBA_assignment.RBA_assignment.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByOib(String oib);
}
