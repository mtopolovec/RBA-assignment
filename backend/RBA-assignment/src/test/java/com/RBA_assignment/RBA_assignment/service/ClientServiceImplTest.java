package com.RBA_assignment.RBA_assignment.service;

import com.RBA_assignment.RBA_assignment.dto.CardStatusMessage;
import com.RBA_assignment.RBA_assignment.dto.ClientDTO;
import com.RBA_assignment.RBA_assignment.model.Client;
import com.RBA_assignment.RBA_assignment.model.Status;
import com.RBA_assignment.RBA_assignment.repository.ClientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.web.client.RestTemplate;

import static com.RBA_assignment.RBA_assignment.model.Status.APPROVED;
import static com.RBA_assignment.RBA_assignment.model.Status.PENDING;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ClientServiceImplTest {

    private ClientRepository clientRepository;
    private ClientServiceImpl clientService;
    private RestTemplate restTemplate;

    private final String oib = "85251569017";

    @BeforeEach
    void setUp() {
        clientRepository = mock(ClientRepository.class);
        restTemplate = mock(RestTemplate.class);
        clientService = new ClientServiceImpl(clientRepository, restTemplate);
    }

    @Test
    void createClient_shouldSaveAndReturnClientDTO() {
        String firstName = "John";
        String lastName = "Doe";

        ClientDTO inputDto = createClientDTO(firstName, lastName, oib, PENDING);
        Client savedEntity = createClient(firstName, lastName, oib, PENDING);

        when(clientRepository.save(any(Client.class))).thenReturn(savedEntity);

        ClientDTO result = clientService.createClient(inputDto);

        ArgumentCaptor<Client> captor = ArgumentCaptor.forClass(Client.class);
        verify(clientRepository).save(captor.capture());
        assertThat(captor.getValue().getOib()).isEqualTo(oib);
        assertThat(result.getOib()).isEqualTo(oib);
        assertThat(result.getFirstName()).isEqualTo(firstName);
        assertThat(result.getLastName()).isEqualTo(lastName);
        assertThat(result.getStatus()).isEqualTo(PENDING);
    }

    @Test
    void getClientByOib_shouldReturnClientDTOAndCreateNewCardRequest() {
        String firstName = "Jane";
        String lastName = "Smith";

        Client clientEntity = createClient(firstName, lastName, oib, APPROVED);

        when(clientRepository.findByOib(oib)).thenReturn(java.util.Optional.of(clientEntity));
        when(restTemplate.postForObject(
                anyString(),
                any(ClientDTO.class),
                eq(CardStatusMessage.class)
        )).thenReturn(null);

        ClientDTO result = clientService.getClientByOib(oib);

        assertThat(result).isNotNull();
        assertThat(result.getOib()).isEqualTo(oib);
        assertThat(result.getFirstName()).isEqualTo(firstName);
        assertThat(result.getLastName()).isEqualTo(lastName);
        assertThat(result.getStatus()).isEqualTo(APPROVED);

        verify(restTemplate).postForObject(
                eq("http://localhost:8080/api/v1/card-request"),
                any(ClientDTO.class),
                eq(CardStatusMessage.class)
        );
    }

    @Test
    void getAllClients_shouldReturnListOfClientDTOs() {
        String oib1 = "11111111111";
        String oib2 = "22222222222";

        String firstName = "Jane";
        String lastName = "Smith";

        String secondFirstName = "John";
        String secondLastName = "Doe";

        Client client1 = createClient(firstName, lastName, oib1, PENDING);
        Client client2 = createClient(secondFirstName, secondLastName, oib2, PENDING);

        when(clientRepository.findAll()).thenReturn(java.util.List.of(client1, client2));

        java.util.List<ClientDTO> result = clientService.getAllClients();

        assertThat(result).hasSize(2);
        assertThat(result.getFirst().getOib()).isEqualTo(oib1);
        assertThat(result.getFirst().getFirstName()).isEqualTo(firstName);
        assertThat(result.getFirst().getLastName()).isEqualTo(lastName);
        assertThat(result.getLast().getOib()).isEqualTo(oib2);
        assertThat(result.getLast().getFirstName()).isEqualTo(secondFirstName);
        assertThat(result.getLast().getLastName()).isEqualTo(secondLastName);
    }

    @Test
    void updateClient_shouldUpdateAndReturnClientDTO() {
        String originalFirstName = "Jane";
        String originalLastName = "Smith";
        String updatedFirstName = "Janet";
        String updatedLastName = "Doe";

        Client existingClient = createClient(originalFirstName, originalLastName, oib, PENDING);
        Client updatedClient = createClient(updatedFirstName, updatedLastName, oib, APPROVED);

        ClientDTO updateDto = createClientDTO(updatedFirstName, updatedLastName, oib, APPROVED);

        when(clientRepository.findByOib(oib)).thenReturn(java.util.Optional.of(existingClient));
        when(clientRepository.save(any(Client.class))).thenReturn(updatedClient);

        ClientDTO result = clientService.updateClient(updateDto);

        assertThat(result).isNotNull();
        assertThat(result.getOib()).isEqualTo(oib);
        assertThat(result.getFirstName()).isEqualTo(updatedFirstName);
        assertThat(result.getLastName()).isEqualTo(updatedLastName);
        assertThat(result.getStatus()).isEqualTo(APPROVED);
    }

    @Test
    void deleteClient_shouldDeleteAndReturnClientDTO() {
        String firstName = "Jane";
        String lastName = "Smith";

        Client clientEntity = createClient(firstName, lastName, oib, PENDING);

        when(clientRepository.findByOib(oib)).thenReturn(java.util.Optional.of(clientEntity));

        ClientDTO result = clientService.deleteClient(oib);

        verify(clientRepository).delete(clientEntity);
        assertThat(result).isNotNull();
        assertThat(result.getOib()).isEqualTo(oib);
        assertThat(result.getFirstName()).isEqualTo(firstName);
        assertThat(result.getLastName()).isEqualTo(lastName);
        assertThat(result.getStatus()).isEqualTo(PENDING);
    }

    private ClientDTO createClientDTO(String firstName, String lastName, String oib, Status status) {
        return new ClientDTO(firstName, lastName, oib, status.toString());
    }

    private Client createClient(String firstName, String lastName, String oib, Status status) {
        return Client.builder()
                .firstName(firstName)
                .lastName(lastName)
                .oib(oib)
                .status(status)
                .build();
    }
}