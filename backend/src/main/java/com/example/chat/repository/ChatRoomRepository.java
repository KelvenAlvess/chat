package com.example.chat.repository;

import com.example.chat.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByChatId(String chatId);

    @Query("SELECT c FROM ChatRoom c WHERE c.chatId LIKE CONCAT(:userId, '\\_%') OR c.chatId LIKE CONCAT('%\\_', :userId)")
    List<ChatRoom> findRoomsByUserId(@Param("userId") Long userId);
}
