package com.example.chat.mapper;

import com.example.chat.dto.ChatRoomRequestDTO;
import com.example.chat.dto.ChatRoomResponseDTO;
import com.example.chat.model.ChatRoom;
import org.springframework.stereotype.Component;

@Component
public class ChatRoomMapper {

    public ChatRoom toEntity(ChatRoomRequestDTO requestDTO) {
        if (requestDTO == null) return null;

        return ChatRoom.builder()
                .roomName(requestDTO.roomName())
                .chatId(requestDTO.chatId())
                .build();
    }

    public ChatRoomResponseDTO toResponseDTO(ChatRoom chatRoom) {
        if (chatRoom == null) return null;

        return new ChatRoomResponseDTO(
                chatRoom.getId(),
                chatRoom.getChatId(),
                chatRoom.getRoomName(),
                chatRoom.getCreatedAt()
        );
    }
}