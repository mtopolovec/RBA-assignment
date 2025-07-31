package com.RBA_assignment.RBA_assignment.configuration;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponseMsg {
    private Integer status;
    private String message;
    private String error;
    private List<String> details;
    private String timestamp;

    public ApiResponseMsg(Integer status, String error, String message, List<String> details) {
        this.status = status;
        this.message = message;
        this.error = error;
        this.details = details;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy - HH:mm:ss"));
    }
}
