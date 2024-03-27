package swp.group5.swp_interior_project.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class RequestDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "request_version_id")
    private RequestVersion requestVersion;
    
    @OneToMany(mappedBy = "requestDetail", cascade = CascadeType.ALL)
    private List<RequestDetailProduct> requestDetailProducts = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;
    
    @Column(columnDefinition = "nvarchar(max)")
    private String description;
    private BigDecimal length;
    private BigDecimal width;
    private BigDecimal area;
}

