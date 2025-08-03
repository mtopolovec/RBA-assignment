package com.RBA_assignment.RBA_assignment.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.UUID;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponseMsg {
    private String code;
    private String id;
    private String description;

    public ApiResponseMsg(Integer code, String description) {
        this.code = String.valueOf(code);
        this.id = UUID.randomUUID().toString();
        this.description = description;
    }
}
