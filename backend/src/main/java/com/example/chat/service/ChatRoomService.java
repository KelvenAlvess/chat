package com.example.chat.service;

import com.example.chat.dto.ChatInboxDTO;
import com.example.chat.model.ChatMessage;
import com.example.chat.model.ChatRoom;
import com.example.chat.model.User;
import com.example.chat.repository.ChatMessageRepository;
import com.example.chat.repository.ChatRoomRepository;
import com.example.chat.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

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

    public String createChatId(Long senderId, Long recipientId) {
        return senderId < recipientId ? senderId + "_" + recipientId : recipientId + "_" + senderId;
    }

    @Transactional(readOnly = true)
    public List<ChatInboxDTO> getUserInbox(Long myUserId) {
        List<ChatRoom> myRooms = chatRoomRepository.findRoomsByUserId(myUserId);

        return myRooms.stream().map(room -> {

            String[] ids = room.getChatId().split("_");
            Long otherUserId = ids[0].equals(String.valueOf(myUserId)) ? Long.parseLong(ids[1]) : Long.parseLong(ids[0]);

            User otherUser = userRepository.findById(otherUserId).orElseThrow();

            Optional<ChatMessage> lastMessage = chatMessageRepository.findTopByChatRoom_ChatIdOrderByTimestampDesc(room.getChatId());
            int unreadCount = chatMessageRepository.countByChatRoom_ChatIdAndRecipient_UserIdAndIsReadFalse(room.getChatId(), myUserId);

            return new ChatInboxDTO(
                    room.getChatId(),
                    otherUserId,
                    otherUser.getUsername(),
                    lastMessage.map(ChatMessage::getContent).orElse(""),
                    lastMessage.map(ChatMessage::getTimestamp).orElse(room.getCreatedAt()),
                    unreadCount
            );
        }).collect(Collectors.toList());
    }
}
