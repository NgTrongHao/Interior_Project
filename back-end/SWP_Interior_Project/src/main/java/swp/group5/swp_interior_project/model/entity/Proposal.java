package swp.group5.swp_interior_project.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import swp.group5.swp_interior_project.model.enums.ProposalStatus;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Entity
public class Proposal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Enumerated(EnumType.STRING)
    private ProposalStatus customerStatus;
    
    @Enumerated(EnumType.STRING)
    private ProposalStatus employeeStatus;
    
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "request_version_id")
    private RequestVersion requestVersion;
    
    private String fileName;
    
    private BigDecimal price;
    private String filePath;
}