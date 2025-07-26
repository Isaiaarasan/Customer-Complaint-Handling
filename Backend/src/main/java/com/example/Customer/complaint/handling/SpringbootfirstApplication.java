package com.example.Customer.complaint.handling;

import com.example.Customer.complaint.handling.models.Role;
import com.example.Customer.complaint.handling.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SpringbootfirstApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootfirstApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(RoleRepository roleRepository) {
		return args -> {
			// Initialize default roles if they don't exist
			if (roleRepository.findByName("USER").isEmpty()) {
				Role userRole = new Role();
				userRole.setName("USER");
				roleRepository.save(userRole);
			}
			
			if (roleRepository.findByName("ADMIN").isEmpty()) {
				Role adminRole = new Role();
				adminRole.setName("ADMIN");
				roleRepository.save(adminRole);
			}
		};
	}
}
