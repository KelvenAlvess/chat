package com.example.chat.dto;

import com.example.chat.model.UserStatus;

import java.time.LocalDateTime;

public record UserResponseDTO(
        Long userId,
        String username,
        UserStatus status,
        String email,
        String cellphoneNumber,
        LocalDateTime createdAt
) {}
