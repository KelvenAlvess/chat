package com.example.chat.dto;

import java.time.LocalDateTime;

public record ChatInboxDTO(
        String chatId,
        Long otherUserId,
        String otherUsername,
        String lastMessageContent,
        LocalDateTime lastMessageTimestamp,
        int unreadCount
) {}