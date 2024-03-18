package swp.group5.swp_interior_project.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import swp.group5.swp_interior_project.model.enums.RequestStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class RequestStatusHistory {
    @Id
    private String id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserInfo user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_version_id", nullable = false)
    private RequestVersion requestVersion;
    
    @ManyToOne(targetEntity = Proposal.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id")
    private Proposal proposal;
    
    @CreatedDate
    private LocalDateTime dateTime;
    
    @PrePersist
    protected void onCreate() {
        if (this.dateTime == null) {
            this.dateTime = LocalDateTime.now();
        }
        this.id = this.requestVersion.getId() + "_" + this.status + "_" + this.dateTime.toString();
    }
}
