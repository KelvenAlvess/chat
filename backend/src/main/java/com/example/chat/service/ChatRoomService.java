package com.example.chat.service;

import com.example.chat.model.ChatRoom;
import com.example.chat.repository.ChatRoomRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    @Transactional
    public ChatRoom getChatRoom(Long senderId, Long recipientId, boolean createIfNotExists) {
        String chatId = createChatId(senderId, recipientId);

        Optional<ChatRoom> roomOptional = chatRoomRepository.findByChatId(chatId);

        if (roomOptional.isPresent()) {
            return roomOptional.get();
        } else {
            if (!createIfNotExists) {
                throw new RuntimeException("Sala de chat não encontrada.");
            }

            ChatRoom newRoom = ChatRoom.builder()
                    .chatId(chatId)
                    .roomName("Chat " + chatId)
                    .build();

            return chatRoomRepository.save(newRoom);
        }
    }

    // Garante que o ID da sala será sempre o menor ID primeiro, seguido do maior.
    // Assim, se o sender for 2 e recipient 1, a sala será "1_2" e não "2_1".
    public String createChatId(Long senderId, Long recipientId) {
        return senderId < recipientId ? senderId + "_" + recipientId : recipientId + "_" + senderId;
    }
}