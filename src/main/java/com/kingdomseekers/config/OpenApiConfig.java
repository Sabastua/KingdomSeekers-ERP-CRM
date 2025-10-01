package com.kingdomseekers.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI kingdomSeekersOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("KingdomSeekers ERP/CRM API")
                        .description("API documentation for KingdomSeekers ERP/CRM system")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("KingdomSeekers")
                                .email("support@kingdomseekers.com"))
                        .license(new License()
                                .name("Private")
                                .url("https://kingdomseekers.com")));
    }
}