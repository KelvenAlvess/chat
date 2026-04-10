package com.example.chat.mapper;

import com.example.chat.dto.UserRequestDTO;
import com.example.chat.dto.UserResponseDTO;
import com.example.chat.model.User;
import com.example.chat.model.UserStatus;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRequestDTO requestDTO) {
        if (requestDTO == null) return null;

        User user = new User();
        user.setUsername(requestDTO.username());
        user.setPassword(requestDTO.password());
        user.setEmail(requestDTO.email());
        user.setCellphoneNumber(requestDTO.cellphoneNumber());
        user.setStatus(UserStatus.ONLINE);

        return user;
    }

    public UserResponseDTO toResponseDTO(User user) {
        if (user == null) return null;

        return new UserResponseDTO(
                user.getUserId(),
                user.getUsername(),
                user.getStatus(),
                user.getEmail(),
                user.getCellphoneNumber(),
                user.getCreatedAt()
        );
    }
}