package swp.group5.swp_interior_project.model.dto.user.authentication;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequestDto {
    @NotBlank(message = "Username cannot be blank.")
    private String username;
    
    @NotBlank(message = "Password cannot be blank.")
    private String password;
}