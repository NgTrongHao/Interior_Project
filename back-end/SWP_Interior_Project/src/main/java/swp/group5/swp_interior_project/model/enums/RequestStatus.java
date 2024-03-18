package swp.group5.swp_interior_project.model.enums;

import lombok.Getter;

@Getter
public enum RequestStatus {
    // For Customers
    REQUESTED("Request submitted"),
    QUOTATION_PROCESSING("Quotation processing"),
    QUOTATION_COMPLETED("Quotation received"),
    CONSTRUCTION_IN_PROGRESS("Construction in progress"),
    CONSTRUCTION_REJECTED("Rejected by customer"), // Use "Rejected" for clarity
    
    // For Staff and Managers
    WAITING_FOR_PLANNING ("Awaiting plan"),
    PROPOSAL_AWAITING_APPROVAL("Awaiting manager approval"), // More descriptive
    MANAGER_APPROVED("Manager approved"),
    MANAGER_REJECTED("Manager rejected");
    
    private final String description;
    
    RequestStatus(String description) {
        this.description = description;
    }
}
