package com.RBA_assignment.RBA_assignment.controller;

import com.RBA_assignment.RBA_assignment.dto.ClientDTO;
import com.RBA_assignment.RBA_assignment.service.ClientService;
import com.RBA_assignment.RBA_assignment.validator.ValidOIB;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;

    @PostMapping
    public ClientDTO createClient(@RequestBody @Valid ClientDTO clientDTO) {
        return clientService.createClient(clientDTO);
    }

    @GetMapping("/{oib}")
    public ClientDTO getClientByOib(@PathVariable @ValidOIB String oib) {
        return clientService.getClientByOib(oib);
    }

    @DeleteMapping("/{oib}")
    public ClientDTO deleteClient(@PathVariable @ValidOIB String oib) {
        return clientService.deleteClient(oib);
    }
}
