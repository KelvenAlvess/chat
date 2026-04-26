package com.example.chat.dto.chat;

import com.example.chat.dto.user.UserResponseDTO;
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
