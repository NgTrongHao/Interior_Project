package swp.group5.swp_interior_project.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp.group5.swp_interior_project.model.dto.user.UserDto;
import swp.group5.swp_interior_project.model.enums.RequestStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestStatusHistoryDto {
    private String id;
    private RequestStatus requestStatus;
    private String requestStatusDescription;
    private UserDto user;
    private LocalDateTime dateTime;
    
    public String getRequestStatusDescription() {
        return requestStatus != null ? requestStatus.getDescription() : null;
    }
}
