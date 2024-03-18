package swp.group5.swp_interior_project.model.dto.user.authentication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthTokenResponse {
    private String token;
    private long expiresIn;
    private List<String> roles;
}