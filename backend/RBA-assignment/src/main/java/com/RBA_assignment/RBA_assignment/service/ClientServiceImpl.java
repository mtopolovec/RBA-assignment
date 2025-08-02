package com.RBA_assignment.RBA_assignment.service;

import com.RBA_assignment.RBA_assignment.dto.ClientDTO;
import com.RBA_assignment.RBA_assignment.mapper.ClientMapper;
import com.RBA_assignment.RBA_assignment.repository.ClientRepository;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.FetchNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository clientRepository;

    @Override
    public ClientDTO createClient(ClientDTO clientDTO) {
        log.info("Creating client: {}", clientDTO);
        return ClientMapper.clientToDto(clientRepository.save(ClientMapper.dtoToClient(clientDTO)));
    }

    @Override
    public ClientDTO getClientByOib(String oib) {
        log.info("Fetching client by OIB: {}", oib);
        return clientRepository.findByOib(oib)
                .map(ClientMapper::clientToDto)
                .orElseGet(() -> {
                    log.warn("Client with OIB {} not found", oib);
                    return null;
                });
    }

    @Override
    public List<ClientDTO> getAllClients() {
        log.info("Fetching all clients");
        return clientRepository.findAll()
                .stream()
                .map(ClientMapper::clientToDto)
                .toList();
    }

    @Override
    public ClientDTO updateClient(ClientDTO clientDTO) {
        log.info("Updating client: {}", clientDTO);
        return clientRepository.findByOib(clientDTO.getOib())
                .map(existingClient -> {
                    existingClient.setFirstName(clientDTO.getFirstName());
                    existingClient.setLastName(clientDTO.getLastName());
                    existingClient.setStatus(clientDTO.getStatus());
                    existingClient.setOib(clientDTO.getOib());
                    return ClientMapper.clientToDto(clientRepository.save(existingClient));
                })
                .orElseThrow(() -> {
                    log.error("Client with OIB {} not found for update", clientDTO.getOib());
                    return new FetchNotFoundException("Client with OIB " + clientDTO.getOib() + " not found", clientDTO.getOib());
                });
    }

    @Override
    public ClientDTO deleteClient(String oib) {
        log.info("Deleting client with OIB: {}", oib);
        return clientRepository.findByOib(oib)
                .map(client -> {
                    clientRepository.delete(client);
                    return ClientMapper.clientToDto(client);
                })
                .orElseThrow(() -> {
                    log.error("Client with OIB {} not found for deletion", oib);
                    return new FetchNotFoundException("Client with OIB " + oib + " not found", oib);
                });
    }
}
