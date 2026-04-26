package com.example.chat.messaging;

import com.example.chat.dto.chat.ChatMessageRequestDTO;
import com.example.chat.dto.chat.ChatMessageResponseDTO;
import com.example.chat.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageConsumer {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "chat-messages-topic", groupId = "chat-group")
    public void consumeMessage(ChatMessageRequestDTO request) {

        ChatMessageResponseDTO savedMessage = chatMessageService.saveMessage(request);

        messagingTemplate.convertAndSendToUser(
                String.valueOf(savedMessage.recipient().userId()),
                "/queue/messages",
                savedMessage
        );
    }
}