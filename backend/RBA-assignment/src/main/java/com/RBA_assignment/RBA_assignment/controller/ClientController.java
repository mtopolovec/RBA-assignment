package com.RBA_assignment.RBA_assignment.controller;

import com.RBA_assignment.RBA_assignment.dto.ClientDTO;
import com.RBA_assignment.RBA_assignment.service.ClientService;
import com.RBA_assignment.RBA_assignment.validator.ValidOIB;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/clients")
public class ClientController {
    private final ClientService clientService;

    @PostMapping
    public ClientDTO createClient(@RequestBody @Valid ClientDTO clientDTO) {
        log.info("Creating client: {}", clientDTO);
        return clientService.createClient(clientDTO);
    }

    @GetMapping("/{oib}")
    public ClientDTO getClientByOib(@PathVariable @ValidOIB String oib) {
        log.info("Fetching client by OIB: {}", oib);
        return clientService.getClientByOib(oib);
    }

    @GetMapping
    public List<ClientDTO> getAllClients() {
        log.info("Fetching all clients");
        return clientService.getAllClients();
    }

    @PutMapping
    public ClientDTO updateClient(@RequestBody @Valid ClientDTO clientDTO) {
        log.info("Updating client: {}", clientDTO);
        return clientService.updateClient(clientDTO);
    }

    @DeleteMapping("/{oib}")
    public ClientDTO deleteClient(@PathVariable @ValidOIB String oib) {
        log.info("Deleting client with OIB: {}", oib);
        return clientService.deleteClient(oib);
    }
}
