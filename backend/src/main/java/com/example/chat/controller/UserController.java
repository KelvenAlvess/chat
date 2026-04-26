package com.example.chat.controller;

import com.example.chat.dto.user.UserContactDTO;
import com.example.chat.dto.user.UserRequestDTO;
import com.example.chat.dto.user.UserResponseDTO;
import com.example.chat.dto.user.UserUpdateDTO;

import com.example.chat.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;


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

    @DeleteMapping("delete/{username}")
    @Operation(summary = "Deletes a user", description = "Deletes the user with the specified username. This endpoint is used for user deletion.")
    public ResponseEntity<Void> deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{username}")
    @Operation(summary = "Updates a user", description = "Updates the email, cellphone or password of an existing user.")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable String username,
            @RequestBody UserUpdateDTO request) {

        UserResponseDTO updatedUser = userService.updateUser(username, request);
        return ResponseEntity.ok(updatedUser);
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


    @GetMapping("/contacts")
    @Operation(summary = "Listar Contactos", description = "Retorna todos os utilizadores registados, exceto o utilizador logado.")
    public ResponseEntity<List<UserContactDTO>> getContacts(Principal principal) {

        Long myId = userService.findByUsername(principal.getName()).userId();
        List<UserContactDTO> contacts = userService.getAvailableContacts(myId);

        return ResponseEntity.ok(contacts);
    }
}