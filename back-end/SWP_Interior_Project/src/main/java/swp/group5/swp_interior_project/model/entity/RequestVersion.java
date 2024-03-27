package swp.group5.swp_interior_project.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class RequestVersion {
    @Id
    private String id;
    
    private int versionNumber;
    
    @Column(columnDefinition = "nvarchar(255)")
    private String description;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", nullable = false)
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private Request request;
    
    @OneToMany(mappedBy = "requestVersion", cascade = CascadeType.ALL)
    private List<RequestStatusHistory> statusHistories = new ArrayList<>();
    
    @OneToMany(mappedBy = "requestVersion", cascade = CascadeType.PERSIST)
    private List<RequestDetail> requestDetails = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        this.id = this.request.getId() + "_" + this.versionNumber;
    }
}

