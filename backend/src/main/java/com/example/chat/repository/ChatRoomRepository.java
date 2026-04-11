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

    List<ChatRoom> findByChatIdStartingWithOrChatIdEndingWith(String prefix, String suffix);
}
