package swp.group5.swp_interior_project.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import swp.group5.swp_interior_project.model.enums.RequestStatus;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private BigDecimal estimatedPrice;
    
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    private RequestStatus requestStatusCustomer;
    
    @Enumerated(EnumType.STRING)
    private RequestStatus requestStatusEmployee;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private UserInfo customer;
    
    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL)
    private List<RequestVersion> versions = new ArrayList<>();
}
