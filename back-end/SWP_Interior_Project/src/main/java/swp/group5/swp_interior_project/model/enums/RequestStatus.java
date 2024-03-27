package swp.group5.swp_interior_project.model.enums;

import lombok.Getter;

@Getter
public enum RequestStatus {
    // For Customers
    REQUESTED("Chờ xác nhận yêu cầu báo giá"),
    QUOTATION_PROCESSING("Báo giá đang được xử lý"),
    QUOTATION_COMPLETED("Báo giá hoàn tất - Chờ xác nhận"),
    CONSTRUCTION_IN_PROGRESS("Báo giá hoàn tất - Tiến hành thi công"),
    CONSTRUCTION_REJECTED("Khách hàng bác bỏ báo giá"), // Use "Rejected" for clarity
    
    // For Staff and Managers
    WAITING_FOR_PLANNING ("Đang chờ đề xuất báo giá"),
    PROPOSAL_AWAITING_APPROVAL("Đề xuất đang chờ được xác nhận"), // More descriptive
    MANAGER_APPROVED("Quản lý chấp thuận đề xuất"),
    MANAGER_REJECTED("Quản lý bác bỏ đề xuất");
    
    private final String description;
    
    RequestStatus(String description) {
        this.description = description;
    }
}
