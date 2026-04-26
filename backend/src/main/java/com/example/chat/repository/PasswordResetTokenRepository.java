package com.example.chat.repository;

import com.example.chat.model.PasswordResetToken;
import com.example.chat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

        Optional<PasswordResetToken> findByToken(String token);

        Optional<PasswordResetToken> findByTokenAndUser(String token, User user);


    void deleteByUser(User user);

    PasswordResetToken token(String token);
}
