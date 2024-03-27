package swp.group5.swp_interior_project.service.interfaces;

import swp.group5.swp_interior_project.model.dto.request.RequestDetailDto;
import swp.group5.swp_interior_project.model.dto.request.RequestVersionDto;
import swp.group5.swp_interior_project.model.entity.Request;
import swp.group5.swp_interior_project.model.entity.RequestVersion;

import java.util.List;

public interface RequestVersionService {
    RequestVersion createNewRequestVersion(Request request, int version);
    
    RequestVersion updateRequestDetailsList(RequestVersion last, List<RequestDetailDto> requestDetails);
    
    RequestVersion getLastRequestVersionByRequest(Request request);
    
    RequestVersionDto convertRequestVersion(RequestVersion requestVersion);
}
