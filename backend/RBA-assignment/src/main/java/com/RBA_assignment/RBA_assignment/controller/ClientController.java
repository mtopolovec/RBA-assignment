package com.RBA_assignment.RBA_assignment.controller;

import com.RBA_assignment.RBA_assignment.dto.ClientDTO;
import com.RBA_assignment.RBA_assignment.service.ClientService;
import com.RBA_assignment.RBA_assignment.validator.ValidOIB;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CrossOrigin
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/clients")
public class ClientController {
    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<ClientDTO> createClient(@RequestBody @Valid ClientDTO clientDTO) {
        log.info("Creating client: {}", clientDTO);
        return ResponseEntity.ok(clientService.createClient(clientDTO));
    }

    @GetMapping("/{oib}")
    public ResponseEntity<ClientDTO> getClientByOib(@PathVariable @ValidOIB String oib) {
        log.info("Fetching client by OIB: {}", oib);
        return ResponseEntity.ok(clientService.getClientByOib(oib));
    }

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        log.info("Fetching all clients");
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @PutMapping
    public ResponseEntity<ClientDTO> updateClient(@RequestBody @Valid ClientDTO clientUpdateRequest) {
        log.info("Updating client: {}", clientUpdateRequest);
        return ResponseEntity.ok(clientService.updateClient(clientUpdateRequest));
    }

    @DeleteMapping("/{oib}")
    public ResponseEntity<ClientDTO> deleteClient(@PathVariable @ValidOIB String oib) {
        log.info("Deleting client with OIB: {}", oib);
        return ResponseEntity.ok(clientService.deleteClient(oib));
    }
}
