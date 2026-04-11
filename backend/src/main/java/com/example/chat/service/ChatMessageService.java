package com.example.chat.service;

import com.example.chat.dto.ChatMessageRequestDTO;
import com.example.chat.dto.ChatMessageResponseDTO;
import com.example.chat.exception.UserNotFoundException;
import com.example.chat.mapper.ChatMessageMapper;
import com.example.chat.model.ChatMessage;
import com.example.chat.model.ChatRoom;
import com.example.chat.model.User;
import com.example.chat.repository.ChatMessageRepository;
import com.example.chat.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository messageRepository;
    private final ChatRoomService chatRoomService;
    private final UserRepository userRepository;
    private final ChatMessageMapper messageMapper;

    @Transactional
    public ChatMessageResponseDTO saveMessage(ChatMessageRequestDTO requestDTO) {
        User sender = userRepository.findById(requestDTO.senderId())
                .orElseThrow(() -> new UserNotFoundException("Remetente não encontrado"));

        User recipient = userRepository.findById(requestDTO.recipientId())
                .orElseThrow(() -> new UserNotFoundException("Destinatário não encontrado"));

        // Se a sala não existir, ele cria na hora
        ChatRoom room = chatRoomService.getChatRoom(sender.getUserId(), recipient.getUserId(), true);

        ChatMessage messageToSave = messageMapper.toEntity(requestDTO, room, sender, recipient);
        ChatMessage savedMessage = messageRepository.save(messageToSave);

        return messageMapper.toResponseDTO(savedMessage);
    }

    @Transactional(readOnly = true)
    public Page<ChatMessageResponseDTO> findChatMessages(Long senderId, Long recipientId, int page, int size) {
        String chatId = chatRoomService.createChatId(senderId, recipientId);
        Pageable pageable = PageRequest.of(page, size);

        Page<ChatMessage> messages = messageRepository.findByChatRoom_ChatIdOrderByTimestampDesc(chatId, pageable);

        return messages.map(messageMapper::toResponseDTO);
    }

    @Transactional
    public void markMessagesAsRead(Long myUserId, Long otherUserId) {
        String chatId = chatRoomService.createChatId(myUserId, otherUserId);
        messageRepository.markMessagesAsRead(chatId, myUserId);
    }
}