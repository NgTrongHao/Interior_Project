package swp.group5.swp_interior_project.service.interfaces;

import swp.group5.swp_interior_project.model.dto.request.RequestDetailDto;
import swp.group5.swp_interior_project.model.entity.RequestDetail;
import swp.group5.swp_interior_project.model.entity.RequestVersion;

import java.util.List;

public interface RequestDetailService {
    RequestDetail createRequestDetail(RequestVersion requestVersion, RequestDetailDto requestDetailDto);
    
    RequestDetailDto convertRequestDetail(RequestDetail requestDetail);
    RequestDetail convertRequestDetail(RequestDetailDto requestDetailDto);
    List<RequestDetail> updateRequestDetailOfRequestVersion(RequestVersion requestVersion, List<RequestDetailDto> requestDetailList);
}
