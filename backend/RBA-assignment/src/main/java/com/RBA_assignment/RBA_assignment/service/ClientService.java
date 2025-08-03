package com.RBA_assignment.RBA_assignment.service;

import com.RBA_assignment.RBA_assignment.dto.ClientDTO;

import java.util.List;

public interface ClientService {
    ClientDTO createClient(ClientDTO clientDTO);
    ClientDTO getClientByOib(String oib);
    List<ClientDTO> getAllClients();
    ClientDTO updateClient(ClientDTO clientDTO);
    ClientDTO deleteClient(String oib);
    void eventChangeClientStatus(String oib, String status);
}
