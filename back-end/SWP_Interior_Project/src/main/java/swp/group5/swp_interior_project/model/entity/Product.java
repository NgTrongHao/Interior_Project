package swp.group5.swp_interior_project.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import swp.group5.swp_interior_project.model.enums.ProductUnit;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "nvarchar(255)")
    private String name;
    
    @Column(columnDefinition = "nvarchar(max)")
    private String description;
    
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    private ProductUnit unit;
    
    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<RequestDetailProduct> requestDetailProducts = new ArrayList<>();
}
