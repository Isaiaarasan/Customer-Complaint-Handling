package com.example.Customer.complaint.handling.services;

import com.example.Customer.complaint.handling.repository.ComplaintRepository;
import com.example.Customer.complaint.handling.models.Complaint;
import com.example.Customer.complaint.handling.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public Complaint saveComplaint(Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByUser(User user) {
        return complaintRepository.findByUser(user);
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id).orElse(null);
    }

    public Complaint updateComplaintStatus(Long id, String status) {
        Complaint complaint = complaintRepository.findById(id).orElse(null);
        if (complaint != null) {
            complaint.setStatus(status);
            return complaintRepository.save(complaint);
        }
        return null;
    }

    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }
}
