package com.example.chat.controller;

import com.example.chat.dto.UserRequestDTO;
import com.example.chat.dto.UserResponseDTO;
import com.example.chat.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Endpoints related to user management")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "registers a new user", description = "Registers a new user with the provided details. This endpoint is used for user registration.")
    public ResponseEntity<UserResponseDTO> registerUser(@RequestBody UserRequestDTO request) {
        UserResponseDTO savedUser = userService.createUser(request);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/online")
    @Operation(summary = "Gets a list of online users", description = "Retrieves a list of all users who are currently online.")
    public ResponseEntity<Page<UserResponseDTO>> getOnlineUsers( @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "10") int size) {

        Page<UserResponseDTO> onlineUser = userService.findConnectedUsers(page, size);
        return ResponseEntity.ok(onlineUser);
    }

    @PostMapping("/{userId}/connect")
    @Operation(summary = "Connects a user", description = "Marks the specified user as connected (online). This endpoint is typically called when a user logs in or establishes a connection to the chat system.")
    public ResponseEntity<Void> connectUser(@PathVariable Long userId) {
        userService.connectUser(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/disconnect")
    @Operation(summary = "Disconects a user", description = "Marks the specified user as disconnected (offline). This endpoint is typically called when a user logs out or disconnects from the chat system.")
    public ResponseEntity<Void> disconnectUser(@PathVariable Long userId) {
        userService.disconnectUser(userId);
        return ResponseEntity.ok().build();
    }
}
