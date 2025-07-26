package com.example.Customer.complaint.handling.controllers;

import com.example.Customer.complaint.handling.models.Complaint;
import com.example.Customer.complaint.handling.models.User;
import com.example.Customer.complaint.handling.repository.UserRepository;
import com.example.Customer.complaint.handling.services.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    // Debug endpoint to test if requests reach the backend
    @GetMapping("/debug")
    public ResponseEntity<?> debugEndpoint(Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "no-auth";
            return ResponseEntity.ok("Debug endpoint reached! User: " + username);
        } catch (Exception e) {
            return ResponseEntity.ok("Debug endpoint reached with error: " + e.getMessage());
        }
    }

    // Test endpoint to create sample complaints
    @PostMapping("/test-data")
    public ResponseEntity<?> createTestData() {
        try {
            // Find or create a test user
            User testUser = userRepository.findByUsername("testuser")
                    .orElseGet(() -> {
                        User user = new User();
                        user.setUsername("testuser");
                        user.setPassword("$2a$10$dummy"); // dummy password
                        return userRepository.save(user);
                    });

            // Create sample complaints
            Complaint complaint1 = new Complaint();
            complaint1.setTitle("Network Issue");
            complaint1.setDescription("Internet connection is very slow");
            complaint1.setCategory("Technical");
            complaint1.setPriority("High");
            complaint1.setCustomerName("testuser");
            complaint1.setComplaintText("Internet connection is very slow");
            complaint1.setStatus("PENDING");
            complaint1.setUser(testUser);
            complaintService.saveComplaint(complaint1);

            Complaint complaint2 = new Complaint();
            complaint2.setTitle("Billing Problem");
            complaint2.setDescription("Incorrect charges on my bill");
            complaint2.setCategory("Service");
            complaint2.setPriority("Medium");
            complaint2.setCustomerName("testuser");
            complaint2.setComplaintText("Incorrect charges on my bill");
            complaint2.setStatus("IN_PROGRESS");
            complaint2.setUser(testUser);
            complaintService.saveComplaint(complaint2);

            return ResponseEntity.ok("Test data created successfully! 2 sample complaints added.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating test data: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createComplaint(@RequestBody Complaint complaint, Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            complaint.setUser(user);
            complaint.setStatus("PENDING");
            
            Complaint savedComplaint = complaintService.saveComplaint(complaint);
            return ResponseEntity.ok(savedComplaint);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating complaint: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        try {
            System.out.println("getAllComplaints endpoint called");
            List<Complaint> complaints = complaintService.getAllComplaints();
            System.out.println("Found " + complaints.size() + " complaints");
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            System.out.println("Error in getAllComplaints: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/my-complaints")
    public ResponseEntity<?> getMyComplaints(Authentication authentication) {
        try {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Complaint> complaints = complaintService.getComplaintsByUser(user);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching complaints: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable Long id) {
        Complaint complaint = complaintService.getComplaintById(id);
        if (complaint != null) {
            return ResponseEntity.ok(complaint);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Complaint complaint = complaintService.updateComplaintStatus(id, status);
            if (complaint != null) {
                return ResponseEntity.ok(complaint);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating complaint: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id) {
        try {
            complaintService.deleteComplaint(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting complaint: " + e.getMessage());
        }
    }
}
