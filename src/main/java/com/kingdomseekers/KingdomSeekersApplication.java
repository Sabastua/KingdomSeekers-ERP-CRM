package com.kingdomseekers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class KingdomSeekersApplication {
    public static void main(String[] args) {
        SpringApplication.run(KingdomSeekersApplication.class, args);
    }
}