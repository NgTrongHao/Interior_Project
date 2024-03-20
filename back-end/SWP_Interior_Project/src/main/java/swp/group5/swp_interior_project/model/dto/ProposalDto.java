package swp.group5.swp_interior_project.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp.group5.swp_interior_project.model.enums.ProposalStatus;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProposalDto {
    private UUID id;
    private ProposalStatus employeeStatus;
    private ProposalStatus customerStatus;
    private String description;
    
    @JsonProperty("file_name")
    private String fileName;
    
    @JsonProperty("file_path")
    private String filePath;
    
    private BigDecimal price;
}