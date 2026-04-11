package com.example.chat.repository;

import com.example.chat.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findByChatRoom_ChatIdOrderByTimestampDesc(String chatId, Pageable pageable);

    Optional<ChatMessage> findTopByChatRoom_ChatIdOrderByTimestampDesc(String chatId);

    int countByChatRoom_ChatIdAndRecipient_UserIdAndIsReadFalse(String chatId, Long recipientId);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.chatRoom.chatId = :chatId AND m.recipient.userId = :recipientId AND m.isRead = false")
    void markMessagesAsRead(@Param("chatId") String chatId, @Param("recipientId") Long recipientId);
}