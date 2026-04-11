package com.example.chat.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Chat API",
                version = "1.0",
                description = "Documentação da API do nosso aplicativo de Chat em Tempo Real"
        ),

        security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
        name = "bearerAuth",
        description = "Cole o seu Token JWT aqui. IMPORTANTE: O Swagger já vai colocar a palavra 'Bearer ' automaticamente para você, então basta colar apenas o código do token (ex: eyJhbGci...).",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class SwaggerConfig {

}