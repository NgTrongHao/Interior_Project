package swp.group5.swp_interior_project.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.group5.swp_interior_project.model.dto.request.RequestDetailDto;
import swp.group5.swp_interior_project.model.dto.request.RequestVersionDto;
import swp.group5.swp_interior_project.model.entity.Request;
import swp.group5.swp_interior_project.model.entity.RequestDetail;
import swp.group5.swp_interior_project.model.entity.RequestVersion;
import swp.group5.swp_interior_project.repository.RequestVersionRepository;
import swp.group5.swp_interior_project.service.interfaces.RequestDetailService;
import swp.group5.swp_interior_project.service.interfaces.RequestStatusHistoryService;
import swp.group5.swp_interior_project.service.interfaces.RequestVersionService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestVersionServiceImpl implements RequestVersionService {
    private final RequestVersionRepository requestVersionRepository;
    private final RequestDetailService requestDetailService;
    private final RequestStatusHistoryService requestStatusHistoryService;
    
    @Autowired
    public RequestVersionServiceImpl(RequestVersionRepository requestVersionRepository, RequestDetailService requestDetailService, RequestStatusHistoryService requestStatusHistoryService) {
        this.requestVersionRepository = requestVersionRepository;
        this.requestDetailService = requestDetailService;
        this.requestStatusHistoryService = requestStatusHistoryService;
    }
    
    @Override
    public RequestVersion createNewRequestVersion(Request request, int version) {
        RequestVersion requestVersion = new RequestVersion();
        requestVersion.setRequest(request);
        requestVersion.setVersionNumber(version);
        return requestVersionRepository.save(requestVersion);
    }
    
    @Override
    public RequestVersion updateRequestDetailsList(RequestVersion requestVersion, List<RequestDetailDto> requestDetails) {
        List<RequestDetail> updatedRequestDetailList = requestDetailService.updateRequestDetailOfRequestVersion(requestVersion, requestDetails);
        
        requestVersion.setRequestDetails(updatedRequestDetailList);
        return requestVersionRepository.save(requestVersion);
    }
    
    @Override
    public RequestVersion getLastRequestVersionByRequest(Request request) {
        List<RequestVersion> versions = request.getVersions();
        int size = versions.size();
        return size > 0 ? versions.get(size - 1) : null;
    }
    
    @Override
    public RequestVersionDto convertRequestVersion(RequestVersion requestVersion) {
        RequestVersionDto requestVersionDto = new RequestVersionDto();
        requestVersionDto.setId(requestVersion.getId());
        requestVersionDto.setRequestStatusHistoryDtoList(requestVersion.getStatusHistories().stream()
                .map(requestStatusHistoryService::convertRequestStatusHistory).collect(Collectors.toList()));
        requestVersionDto.setDescription(requestVersion.getDescription());
        requestVersionDto.setVersionNumber(requestVersion.getVersionNumber());
        return requestVersionDto;
    }
}
