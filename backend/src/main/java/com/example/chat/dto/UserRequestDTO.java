package com.example.chat.dto;

public record UserRequestDTO(
        String username,
        String password,
        String email,
        String cellphoneNumber
) {}

