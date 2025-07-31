package com.RBA_assignment.RBA_assignment.service;

import com.RBA_assignment.RBA_assignment.dto.ClientDTO;
import com.RBA_assignment.RBA_assignment.mapper.ClientMapper;
import com.RBA_assignment.RBA_assignment.repository.ClientRepository;
import org.hibernate.FetchNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository clientRepository;

    @Override
    public ClientDTO createClient(ClientDTO clientDTO) {
        return ClientMapper.clientToDto(clientRepository.save(ClientMapper.dtoToClient(clientDTO)));
    }

    @Override
    public ClientDTO getClientByOib(String oib) {
        return clientRepository.findByOib(oib)
                .map(ClientMapper::clientToDto)
                .orElse(null);
    }

    @Override
    public ClientDTO deleteClient(String oib) {
        return clientRepository.findByOib(oib)
                .map(client -> {
                    clientRepository.delete(client);
                    return ClientMapper.clientToDto(client);
                })
                .orElseThrow(() -> new FetchNotFoundException("Client with OIB " + oib + " not found", oib));
    }
}
