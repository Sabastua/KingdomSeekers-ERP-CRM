package com.kingdomseekers.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:.env")
public class EnvConfig {
    // This class enables loading variables from .env file
    // No additional code needed as Spring will handle the property loading
}