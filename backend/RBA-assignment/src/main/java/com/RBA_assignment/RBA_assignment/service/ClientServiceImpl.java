package com.RBA_assignment.RBA_assignment.service;

import com.RBA_assignment.RBA_assignment.dto.CardStatusMessage;
import com.RBA_assignment.RBA_assignment.dto.ClientDTO;
import com.RBA_assignment.RBA_assignment.mapper.ClientMapper;
import com.RBA_assignment.RBA_assignment.model.Client;
import com.RBA_assignment.RBA_assignment.model.Status;
import com.RBA_assignment.RBA_assignment.repository.ClientRepository;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.FetchNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository clientRepository;
    private final RestTemplate restTemplate;

    @Override
    public ClientDTO createClient(ClientDTO clientDTO) {
        if (clientRepository.findByOib(clientDTO.getOib()).isPresent()) {
            throw new EntityExistsException("Client with OIB " + clientDTO.getOib() + " already exists");
        }
        return ClientMapper.clientToDto(clientRepository.save(ClientMapper.dtoToClient(clientDTO)));
    }

    @Override
    public ClientDTO getClientByOib(String oib) {
        return clientRepository.findByOib(oib)
                .map(client -> {
                    ClientDTO dto = ClientMapper.clientToDto(client);
                    restTemplate.postForObject(
                            "http://localhost:8080/api/v1/card-request",
                            new ClientDTO(client.getFirstName(), client.getLastName(), client.getOib(), client.getStatus().toString()),
                            CardStatusMessage.class
                    );
                    return dto;
                })
                .orElseGet(() -> {
                    log.warn("Client with OIB {} not found", oib);
                    return null;
                });
    }

    @Override
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(ClientMapper::clientToDto)
                .toList();
    }

    @Override
    public ClientDTO updateClient(ClientDTO clientDTO) {
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

    @Override
    public void eventChangeClientStatus(String oib, String status) {
        log.info("Changing client status for OIB: {} to status: {}", oib, status);
        Client client = clientRepository.findByOib(oib)
                .orElseThrow(() -> new FetchNotFoundException("Client not found for OIB: " + oib, oib));

        Status newStatus = Status.valueOf(status.toUpperCase());
        client.setStatus(newStatus);
        clientRepository.save(client);
        log.info("Client status changed successfully: {}", status);
    }
}
