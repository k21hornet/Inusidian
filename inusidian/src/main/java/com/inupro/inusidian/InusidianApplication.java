package com.inupro.inusidian;

import com.inupro.inusidian.config.DotenvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class InusidianApplication {
	String origin = DotenvConfig.get("CORS_ALLOWED_ORIGIN");

	public static void main(String[] args) {
		SpringApplication.run(InusidianApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins(origin)
						.allowedMethods("GET", "POST", "PUT", "DELETE")
						.allowedHeaders("*") // すべてのヘッダーを許可
						.allowCredentials(true); // クッキーを使用するため
			}
		};
	}

}
