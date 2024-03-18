package swp.group5.swp_interior_project.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Workspace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String workspaceName;
    
    @OneToMany
    @JoinColumn(name = "workspace_id")
    private List<Product> products = new ArrayList<>();
}
