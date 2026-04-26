package com.example.chat.dto.user;

public record UserRequestDTO(
        String username,
        String password,
        String email,
        String cellphoneNumber
) {}

