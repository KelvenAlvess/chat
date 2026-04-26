package com.example.chat.dto.chat;

import com.example.chat.model.MessageType;

public record ChatMessageRequestDTO(
        Long chatRoomId,
        Long senderId,
        Long recipientId,
        String content,
        MessageType messageType
) {}
