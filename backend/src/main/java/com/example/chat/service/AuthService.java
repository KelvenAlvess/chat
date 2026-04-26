package com.example.chat.service;

import com.example.chat.exception.EmailNotFoundException;
import com.example.chat.exception.ExpiredCodeException;
import com.example.chat.exception.InvalidCodeException;
import com.example.chat.model.PasswordResetToken;
import com.example.chat.model.User;
import com.example.chat.repository.PasswordResetTokenRepository;
import com.example.chat.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailSender;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EmailNotFoundException("Email não encontrado: " + email));

        tokenRepository.deleteByUser(user);

        String code = String.format("%06d", new Random().nextInt(999999));

        PasswordResetToken token = PasswordResetToken.builder()
                .token(code)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();

        tokenRepository.save(token);

        emailService.sendPasswordResetEmail(user.getEmail(), code);
    }

    @Transactional
    public void verifyCode(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EmailNotFoundException(email));

        PasswordResetToken resetToken = tokenRepository.findByTokenAndUser(code, user)
                .orElseThrow(() -> new InvalidCodeException("Código de verificação inválido"));

        if(resetToken.isExpired()){
            throw new ExpiredCodeException("Código de verificação expirado");
        }
    }

    @Transactional
    public void resetPassword(String email, String code, String newPassword) {
        verifyCode(email, code);

        User user = userRepository.findByEmail(email).get();

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.deleteByUser(user);
    }
}
