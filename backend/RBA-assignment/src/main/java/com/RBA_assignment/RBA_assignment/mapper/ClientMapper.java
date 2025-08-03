package com.RBA_assignment.RBA_assignment.mapper;

import com.RBA_assignment.RBA_assignment.dto.ClientDTO;
import com.RBA_assignment.RBA_assignment.model.Client;

public class ClientMapper {
    public static ClientDTO clientToDto(Client client) {
        if (client == null) {
            return null;
        }
        return new ClientDTO(
                client.getFirstName(),
                client.getLastName(),
                client.getOib(),
                client.getStatus().toString()
        );
    }

    public static Client dtoToClient(ClientDTO clientDTO) {
        if (clientDTO == null) {
            return null;
        }
        return Client.builder()
                .firstName(clientDTO.getFirstName())
                .lastName(clientDTO.getLastName())
                .oib(clientDTO.getOib())
                .status(clientDTO.getStatus())
                .build();
    }
}
