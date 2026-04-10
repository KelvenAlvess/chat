package com.example.chat.service;

import com.example.chat.dto.UserRequestDTO;
import com.example.chat.dto.UserResponseDTO;
import com.example.chat.dto.UserUpdateDTO;
import com.example.chat.exception.UserAlreadyExistsException;
import com.example.chat.exception.UserNotFoundException;
import com.example.chat.mapper.UserMapper;
import com.example.chat.model.User;
import com.example.chat.model.UserStatus;
import com.example.chat.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.example.chat.model.UserStatus.OFFLINE;
import static com.example.chat.model.UserStatus.ONLINE;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO dto) {

        if(userRepository.findByUsername(dto.username()).isPresent()) {
            throw new UserAlreadyExistsException("Username already exists: " + dto.username());
        }

        User userToSave = userMapper.toEntity(dto);

        String hashedPassword = passwordEncoder.encode(dto.password());
        userToSave.setPassword(hashedPassword);

        userRepository.save(userToSave);

        return userMapper.toResponseDTO(userToSave);
    }

    @Transactional
    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Username not found: " + username));

        user.setActive(false);
        user.setStatus(UserStatus.OFFLINE);

        userRepository.save(user);
    }

    @Transactional
    public UserResponseDTO updateUser(String currentUsername, UserUpdateDTO dto) {

        User existingUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UserNotFoundException("Username not found: " + currentUsername));

        if (dto.email() != null && !dto.email().isBlank()) {
            existingUser.setEmail(dto.email());
        }

        if (dto.cellphoneNumber() != null && !dto.cellphoneNumber().isBlank()) {
            existingUser.setCellphoneNumber(dto.cellphoneNumber());
        }

        if (dto.password() != null && !dto.password().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(dto.password()));
        }


        User updatedUser = userRepository.save(existingUser);

        return userMapper.toResponseDTO(updatedUser);
    }

    @Transactional
    public void connectUser(Long userId) {
        User user = userRepository.findById(userId).
                orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        user.setStatus(ONLINE);
        userRepository.save(user);
    }

    @Transactional
    public void disconnectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        user.setStatus(OFFLINE);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Page<UserResponseDTO> findConnectedUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepository.findAllByStatus(UserStatus.ONLINE, pageable);
        return usersPage.map(userMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));

        return userMapper.toResponseDTO(user);
    }

    @Transactional(readOnly = true)
    public Page<UserResponseDTO> findAllUsers(int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepository.findAll(pageable);
        return usersPage.map(userMapper::toResponseDTO);
    }
}