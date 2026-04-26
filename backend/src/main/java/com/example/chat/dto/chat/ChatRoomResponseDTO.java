package com.example.chat.dto.chat;

import java.time.LocalDateTime;

public record ChatRoomResponseDTO(
        Long id,
        String chatId,
        String roomName,
        LocalDateTime createdAt
) {}

