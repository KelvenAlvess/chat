package com.example.chat.controller;

import com.example.chat.dto.ChatMessageRequestDTO;
import com.example.chat.dto.ChatMessageResponseDTO;
import com.example.chat.service.ChatMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "Chat", description = "Endpoints para troca de mensagens e histórico")
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessageRequestDTO request) {

        ChatMessageResponseDTO savedMessage = chatMessageService.saveMessage(request);

        // O app React Native do destinatário deverá escutar em: /user/{id_dele}/queue/messages
        messagingTemplate.convertAndSendToUser(
                String.valueOf(request.recipientId()),
                "/queue/messages",
                savedMessage
        );
    }

    @GetMapping("/api/messages/{senderId}/{recipientId}")
    @Operation(summary = "Histórico do Chat", description = "Busca as mensagens antigas de forma paginada")
    public ResponseEntity<Page<ChatMessageResponseDTO>> getChatHistory(
            @PathVariable Long senderId,
            @PathVariable Long recipientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size) {

        Page<ChatMessageResponseDTO> history = chatMessageService.findChatMessages(senderId, recipientId, page, size);
        return ResponseEntity.ok(history);
    }
}