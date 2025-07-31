package com.RBA_assignment.RBA_assignment.dto;

import com.RBA_assignment.RBA_assignment.model.Status;
import com.RBA_assignment.RBA_assignment.validator.ValidOIB;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClientDTO {
    @NotBlank(message = "First name cannot be blank.")
    @NotNull(message = "First name cannot be null.")
    @Size(min = 3, max = 30)
    @Pattern(regexp = "^[A-Za-z]+$", message = "First name must contain only letters.")
    private String firstName;

    @NotBlank(message = "Last name cannot be blank.")
    @NotNull(message = "Last name cannot be null.")
    @Pattern(regexp = "^[A-Za-z]+$", message = "Last name must contain only letters.")
    @Size(min = 3, max = 50)
    private String lastName;

    @ValidOIB
    private String oib;

    @NotNull(message = "Status is required.")
    private Status status;
}
