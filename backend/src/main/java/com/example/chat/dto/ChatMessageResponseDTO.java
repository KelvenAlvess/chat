package com.example.chat.dto;

import com.example.chat.model.MessageType;

import java.time.LocalDateTime;

public record ChatMessageResponseDTO(
        Long messageId,
        ChatRoomResponseDTO chatRoom,
        UserResponseDTO sender,
        UserResponseDTO recipient,
        String content,
        MessageType type,
        LocalDateTime timestamp
) {
}
