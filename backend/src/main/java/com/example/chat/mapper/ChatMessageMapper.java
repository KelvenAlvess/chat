package com.example.chat.mapper;

import com.example.chat.dto.ChatMessageRequestDTO;
import com.example.chat.dto.ChatMessageResponseDTO;
import com.example.chat.model.ChatMessage;
import com.example.chat.model.ChatRoom;
import com.example.chat.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatMessageMapper {

    private final UserMapper userMapper;
    private final ChatRoomMapper chatRoomMapper;

    public ChatMessage toEntity(ChatMessageRequestDTO requestDTO, ChatRoom room, User sender, User recipient) {
        if (requestDTO == null) return null;

        return ChatMessage.builder()
                .chatRoom(room)
                .sender(sender)
                .recipient(recipient)
                .content(requestDTO.content())
                .type(requestDTO.messageType())
                .build();
    }

    public ChatMessageResponseDTO toResponseDTO(ChatMessage message) {
        if (message == null) return null;

        return new ChatMessageResponseDTO(
                message.getMessageId(),
                chatRoomMapper.toResponseDTO(message.getChatRoom()), // Reaproveita o mapper
                userMapper.toResponseDTO(message.getSender()),       // Reaproveita o mapper
                userMapper.toResponseDTO(message.getRecipient()),    // Reaproveita o mapper
                message.getContent(),
                message.getType(),
                message.getTimestamp()
        );
    }
}