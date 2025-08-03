package com.RBA_assignment.RBA_assignment.dto;

import com.RBA_assignment.RBA_assignment.model.Status;
import com.RBA_assignment.RBA_assignment.validator.ValidOIB;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CardStatusMessage {
    @ValidOIB
    private String oib;

    @NotNull(message = "Status is required.")
    @Pattern(
            regexp = "(?i)INACTIVE|ACTIVE|PENDING|APPROVED|REJECTED|BLOCKED",
            message = "Status must be one of: INACTIVE, ACTIVE, PENDING, APPROVED, REJECTED, BLOCKED."
    )
    private String status;

    public Status getStatus() {
        return Status.valueOf(status.toUpperCase());
    }
}
