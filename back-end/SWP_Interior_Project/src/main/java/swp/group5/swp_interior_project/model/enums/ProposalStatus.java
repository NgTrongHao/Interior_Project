package swp.group5.swp_interior_project.model.enums;

import lombok.Getter;

@Getter
public enum ProposalStatus {
    PENDING("Chờ xác nhận"),
    APPROVED("Chấp thuận"),
    REJECTED("Bác bỏ");
    
    private final String description;
    
    ProposalStatus(String description) {
        this.description = description;
    }
}
