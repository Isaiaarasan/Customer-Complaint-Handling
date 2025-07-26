package com.example.Customer.complaint.handling.controllers;
import com.example.Customer.complaint.handling.dto.AuthRequest;
import com.example.Customer.complaint.handling.dto.AuthResponse;
import com.example.Customer.complaint.handling.dto.RegisterRequest;
import com.example.Customer.complaint.handling.jwt.JwtService;
import com.example.Customer.complaint.handling.models.Role;
import com.example.Customer.complaint.handling.models.User;
import com.example.Customer.complaint.handling.repository.RoleRepository;
import com.example.Customer.complaint.handling.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Debug endpoint to check current user's authentication and roles
    @GetMapping("/debug")
    public ResponseEntity<?> debugAuth(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.ok("No authentication found");
            }
            
            String username = authentication.getName();
            List<String> authorities = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            
            User user = userRepository.findByUsername(username).orElse(null);
            List<String> userRoles = user != null ? 
                user.getRoles().stream().map(Role::getName).collect(Collectors.toList()) : 
                List.of();
            
            return ResponseEntity.ok(Map.of(
                "username", username,
                "authorities", authorities,
                "userRoles", userRoles,
                "authenticated", authentication.isAuthenticated()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Test endpoint to check roles
    @GetMapping("/roles")
    public ResponseEntity<?> getAllRoles() {
        try {
            List<Role> roles = roleRepository.findAll();
            return ResponseEntity.ok("Available roles: " + roles.stream().map(Role::getName).toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching roles: " + e.getMessage());
        }
    }

    // Debug endpoint to check all users and their roles
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            StringBuilder result = new StringBuilder("Users:\n");
            for (User user : users) {
                result.append("ID: ").append(user.getId())
                      .append(", Username: ").append(user.getUsername())
                      .append(", Roles: ").append(user.getRoles() != null ? 
                          user.getRoles().stream().map(Role::getName).toList() : "null")
                      .append("\n");
            }
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching users: " + e.getMessage());
        }
    }

    // ✅ Register a new user
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest().body("Username is already taken!");
            }

            // Create new user
            User user = new User();
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            // Set default role if no roles specified
            Set<String> rolesToAssign = request.getRoles();
            if (rolesToAssign == null || rolesToAssign.isEmpty()) {
                rolesToAssign = Set.of("USER");
            }

            // Assign roles to user
            Set<Role> roles = new HashSet<>();
            for (String roleName : rolesToAssign) {
                Role role = roleRepository.findByName(roleName.toUpperCase())
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                roles.add(role);
            }

            user.setRoles(roles);
            
            // Save user
            User savedUser = userRepository.save(user);
            
            // Verify roles were saved
            if (savedUser.getRoles() == null || savedUser.getRoles().isEmpty()) {
                return ResponseEntity.badRequest().body("Failed to assign roles to user");
            }

            return ResponseEntity.ok("User registered successfully with roles: " + 
                    savedUser.getRoles().stream().map(Role::getName).toList());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    // ✅ Login existing user
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String token = jwtService.generateToken(authentication);
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    // ✅ Example secured endpoint (get user info)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        try {
            User user = userRepository.findByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get profile: " + e.getMessage());
        }
    }
}
