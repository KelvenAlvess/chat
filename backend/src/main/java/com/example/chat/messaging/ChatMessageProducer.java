package com.example.chat.messaging;

import com.example.chat.dto.ChatMessageRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageProducer {

    private final KafkaTemplate<String, ChatMessageRequestDTO> kafkaTemplate;
    private static final String TOPIC = "chat-messages-topic";

    public void sendChatMessageEvent(ChatMessageRequestDTO message) {

        kafkaTemplate.send(TOPIC, message);
    }
}