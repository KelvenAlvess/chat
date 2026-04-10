package com.example.chat.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@RequiredArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(name = "username",unique = true, nullable = false)
    private String username;

    @Column(name = "password_hash")
    private String password;

    @Column(name = "email",unique = true)
    private String email;

    @Column(name = "status")
    private UserStatus status;

    @Column(name = "cellphone_number")
    private String cellphoneNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
