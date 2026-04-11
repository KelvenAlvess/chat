package com.example.chat.controller;

import com.example.chat.dto.ChatInboxDTO;
import com.example.chat.dto.ChatMessageRequestDTO;
import com.example.chat.dto.ChatMessageResponseDTO;
import com.example.chat.service.ChatMessageService;
import com.example.chat.service.ChatRoomService;
import com.example.chat.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "Endpoints para troca de mensagens e histórico")
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    private Long getAuthenticatedUserId(Principal principal) {
        return userService.findByUsername(principal.getName()).userId();
    }

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessageRequestDTO request) {
        ChatMessageResponseDTO savedMessage = chatMessageService.saveMessage(request);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(request.recipientId()),
                "/queue/messages",
                savedMessage
        );
    }

    @PostMapping("/messages")
    @Operation(summary = "Enviar Mensagem (REST)", description = "Salva uma mensagem no banco e notifica o destinatário em tempo real via WebSocket.")
    public ResponseEntity<ChatMessageResponseDTO> sendMessageRest(
            Principal principal,
            @RequestBody ChatMessageRequestDTO request) {

        Long myId = getAuthenticatedUserId(principal);

        ChatMessageRequestDTO secureRequest = new ChatMessageRequestDTO(
                request.chatRoomId(),
                myId,
                request.recipientId(),
                request.content(),
                request.messageType()
        );

        ChatMessageResponseDTO savedMessage = chatMessageService.saveMessage(secureRequest);

        messagingTemplate.convertAndSendToUser(
                String.valueOf(secureRequest.recipientId()),
                "/queue/messages",
                savedMessage
        );

        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping("/inbox")
    @Operation(summary = "Lista de Conversas (Inbox)", description = "Busca todas as conversas do usuário logado com a última mensagem e contador de não lidas.")
    public ResponseEntity<List<ChatInboxDTO>> getMyInbox(Principal principal) {
        Long myId = getAuthenticatedUserId(principal);
        List<ChatInboxDTO> inbox = chatRoomService.getUserInbox(myId);
        return ResponseEntity.ok(inbox);
    }

    @GetMapping("/messages/{otherUserId}")
    @Operation(summary = "Histórico do Chat", description = "Busca as mensagens antigas de forma paginada entre o usuário logado e outro usuário especificado.")
    public ResponseEntity<Page<ChatMessageResponseDTO>> getChatHistory(
            Principal principal,
            @PathVariable Long otherUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size) {

        Long myId = getAuthenticatedUserId(principal);
        Page<ChatMessageResponseDTO> history = chatMessageService.findChatMessages(myId, otherUserId, page, size);
        return ResponseEntity.ok(history);
    }

    @PutMapping("/messages/{otherUserId}/read")
    @Operation(summary = "Marcar como Lido", description = "Marca todas as mensagens enviadas por um usuário específico para o usuário logado como lidas.")
    public ResponseEntity<Void> markAsRead(Principal principal, @PathVariable Long otherUserId) {
        Long myId = getAuthenticatedUserId(principal);
        chatMessageService.markMessagesAsRead(myId, otherUserId);
        return ResponseEntity.ok().build();
    }
}