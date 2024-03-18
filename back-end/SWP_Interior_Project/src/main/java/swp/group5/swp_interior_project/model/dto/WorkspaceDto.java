package swp.group5.swp_interior_project.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceDto {
    private Long id;
    @NotEmpty(message = "Workspace name is required")
    @JsonProperty("workspace_name")
    private String workspaceName;
    private List<ProductDto> productList;
}
