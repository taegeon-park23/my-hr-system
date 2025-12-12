package com.hr.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.hr")
@EntityScan(basePackages = "com.hr")
@EnableJpaRepositories(basePackages = "com.hr")
public class HrSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(HrSystemApplication.class, args);
    }
}
