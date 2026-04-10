package com.example.chat.controller;

import com.example.chat.dto.AuthResponseDTO;
import com.example.chat.dto.LoginRequestDTO;
import com.example.chat.model.User;
import com.example.chat.repository.UserRepository;
import com.example.chat.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository; // Apenas para buscar o ID e enviar no retorno

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
        String jwtToken = jwtService.generateToken(userDetails);

        User user = userRepository.findByUsername(request.username()).orElseThrow();

        return ResponseEntity.ok(new AuthResponseDTO(jwtToken, user.getUserId(), user.getUsername()));
    }
}