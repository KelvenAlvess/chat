package com.example.chat.repository;

import com.example.chat.model.ChatMessage; // Certifique-se de que o import está correto
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findByChatRoom_ChatIdOrderByTimestampDesc(String chatId, Pageable pageable);
}