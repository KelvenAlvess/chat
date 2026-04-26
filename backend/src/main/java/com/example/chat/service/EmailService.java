package com.example.chat.service;

import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender emailSender;
    private final MailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendPasswordResetEmail(@NotBlank String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Reset Password");

        message.setText("Olá!\n\n"
                + "Você solicitou a recuperação da sua senha.\n"
                + "Seu código de verificação é: " + token + "\n\n"
                + "Este código é válido por 15 minutos.\n"
                + "Se você não solicitou esta alteração, por favor, ignore este e-mail e sua senha continuará segura.");

        mailSender.send(message);
    }
}
