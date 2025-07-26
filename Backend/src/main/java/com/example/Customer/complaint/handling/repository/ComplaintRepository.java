package com.example.Customer.complaint.handling.repository;
import com.example.Customer.complaint.handling.models.Complaint;
import com.example.Customer.complaint.handling.models.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUser(User user);
}
