package swp.group5.swp_interior_project.model.dto.user.employee;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    
    private Long id;
    
    @JsonProperty("full_name")
    @NotEmpty(message = "Name is required")
    @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
    private String fullName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Phone number must have 10 digits")
    private String phone;
    
    @Pattern(regexp = "\\d{9,12}", message = "ID card number must have 9-12 digits")
    private String id_card;
    
    private String address;
    
    @NotBlank(message = "Username is required")
    private String username;
    
    //@NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    private boolean status;
    private Set<String> roles;
}