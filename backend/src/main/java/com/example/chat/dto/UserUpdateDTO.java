package com.example.chat.dto;

public record UserUpdateDTO(
        String email,
        String cellphoneNumber,
        String password
) {}