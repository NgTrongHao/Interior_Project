package swp.group5.swp_interior_project.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestVersionDto {
    private String id;
    private String description;
    private int versionNumber;
    private List<RequestStatusHistoryDto> requestStatusHistoryDtoList;
}
