package com.RBA_assignment.RBA_assignment.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum Status {
    INACTIVE("Inactive"),
    ACTIVE("Active"),
    PENDING("Pending"),
    APPROVED("Approved"),
    REJECTED("Rejected"),
    BLOCKED("Active");

    private final String status;

    Status(String status) {
        this.status = status;
    }

    @JsonCreator
    public static Status fromString(String value) {
        if (value == null) {
            return null;
        }
        return Status.valueOf(value.trim().toUpperCase());
    }

    @JsonValue
    public String toJson() {
        return name().toLowerCase();
    }

}
