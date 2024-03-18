package swp.group5.swp_interior_project.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import swp.group5.swp_interior_project.model.enums.AccountRole;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table
public class UserInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Column(name = "email", length = 50, nullable = false)
    private String email;
    
    @Column(name = "phone", length = 10, nullable = false)
    private String phone;
    
    @Column(name = "id_card", unique = true)
    private String idCard;
    
    @Column(name = "note")
    private String note;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "status")
    private boolean status;
    
    @ElementCollection(targetClass = AccountRole.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Set<AccountRole> roles = new HashSet<>();
    
}
