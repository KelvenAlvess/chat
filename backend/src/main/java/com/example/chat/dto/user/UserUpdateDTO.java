package com.example.chat.dto.user;

public record UserUpdateDTO(
        String email,
        String cellphoneNumber,
        String password
) {}