package swp.group5.swp_interior_project.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.group5.swp_interior_project.exception.NotFoundEntityException;
import swp.group5.swp_interior_project.model.dto.ProposalDto;
import swp.group5.swp_interior_project.model.entity.*;
import swp.group5.swp_interior_project.model.enums.ProposalStatus;
import swp.group5.swp_interior_project.model.enums.RequestStatus;
import swp.group5.swp_interior_project.repository.ProposalRepository;
import swp.group5.swp_interior_project.repository.RequestRepository;
import swp.group5.swp_interior_project.service.interfaces.ProposalService;
import swp.group5.swp_interior_project.service.interfaces.RequestStatusHistoryService;
import swp.group5.swp_interior_project.service.interfaces.RequestVersionService;
import swp.group5.swp_interior_project.service.interfaces.UserInfoService;

import java.util.UUID;

@Service
public class ProposalServiceImpl implements ProposalService {
    private final RequestRepository requestRepository;
    private final RequestVersionService requestVersionService;
    private final ProposalRepository proposalRepository;
    private final UserInfoService userInfoService;
    private final RequestStatusHistoryService requestStatusHistoryService;
    
    @Autowired
    public ProposalServiceImpl(RequestRepository requestRepository, RequestVersionService requestVersionService, ProposalRepository proposalRepository, UserInfoService userInfoService, RequestStatusHistoryService requestStatusHistoryService) {
        this.requestRepository = requestRepository;
        this.requestVersionService = requestVersionService;
        this.proposalRepository = proposalRepository;
        this.userInfoService = userInfoService;
        this.requestStatusHistoryService = requestStatusHistoryService;
    }
    
    @Override
    public UUID saveProposal(UUID requestId, String username, ProposalDto proposalDto){
        Request request = requestRepository.findById(requestId).orElseThrow(() -> new NotFoundEntityException("Request not found"));
        request.setRequestStatusEmployee(RequestStatus.PROPOSAL_AWAITING_APPROVAL);
        RequestVersion requestVersion = requestVersionService.getLastRequestVersionByRequest(request);
        RequestStatusHistory requestStatusHistory = requestStatusHistoryService.createNewRequestStatusHistory(requestVersion, RequestStatus.PROPOSAL_AWAITING_APPROVAL, userInfoService.findByUsername(username));
        
        Proposal proposal = new Proposal();
        proposal.setRequestVersion(requestVersion);
        proposal.setPrice(proposalDto.getPrice());
        proposal.setFileName(proposalDto.getFileName());
        proposal.setFilePath(proposalDto.getFilePath());
        proposal.setEmployeeStatus(ProposalStatus.PENDING);
        requestStatusHistory.setProposal(proposal);
        
        return proposalRepository.save(proposal).getId();
    }
    
    @Override
    public ProposalDto convertProposal(Proposal proposal) {
        ProposalDto proposalDto = new ProposalDto();
        proposalDto.setId(proposal.getId());
        proposalDto.setDescription(proposal.getDescription());
        proposalDto.setFileName(proposal.getFileName());
        proposalDto.setEmployeeStatus(proposal.getEmployeeStatus());
        proposalDto.setCustomerStatus(proposal.getCustomerStatus());
        proposalDto.setFilePath(proposal.getFilePath());
        return proposalDto;
    }
    
    @Override
    public void confirmProposal(String username, UUID proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId).orElseThrow(() -> new NotFoundEntityException("Proposal not found"));
        if (proposal != null) {
            proposal.setEmployeeStatus(ProposalStatus.APPROVED);
            Request request = proposal.getRequestVersion().getRequest();
            request.setRequestStatusEmployee(RequestStatus.MANAGER_APPROVED);
            request.setRequestStatusCustomer(RequestStatus.QUOTATION_COMPLETED);
            request.setPrice(proposal.getPrice());
            
            UserInfo userInfo = userInfoService.findByUsername(username);
            RequestStatusHistory requestStatusHistory = requestStatusHistoryService.createNewRequestStatusHistory(requestVersionService.getLastRequestVersionByRequest(request), RequestStatus.MANAGER_APPROVED, userInfo);
            requestStatusHistory.setProposal(proposal);
            proposalRepository.save(proposal);
        }
    }
    
    @Override
    public void rejectProposal(String username, UUID proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId).orElseThrow(() -> new NotFoundEntityException("Proposal not found"));
        if (proposal != null) {
            proposal.setEmployeeStatus(ProposalStatus.REJECTED);
            Request request = proposal.getRequestVersion().getRequest();
            request.setRequestStatusEmployee(RequestStatus.MANAGER_REJECTED);
            
            UserInfo userInfo = userInfoService.findByUsername(username);
            RequestStatusHistory requestStatusHistory = requestStatusHistoryService.createNewRequestStatusHistory(requestVersionService.getLastRequestVersionByRequest(request), RequestStatus.MANAGER_REJECTED, userInfo);
            requestStatusHistory.setProposal(proposal);
            proposalRepository.save(proposal);
        }
    }
    
    @Override
    public void confirmProposalByCustomer(String username, UUID proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId).orElseThrow(() -> new NotFoundEntityException("Proposal not found"));
        if (proposal != null) {
            proposal.setCustomerStatus(ProposalStatus.APPROVED);
            Request request = proposal.getRequestVersion().getRequest();
            request.setRequestStatusCustomer(RequestStatus.CONSTRUCTION_IN_PROGRESS);
            request.setRequestStatusEmployee(RequestStatus.CONSTRUCTION_IN_PROGRESS);
            
            UserInfo userInfo = userInfoService.findByUsername(username);
            RequestStatusHistory requestStatusHistory = requestStatusHistoryService.createNewRequestStatusHistory(requestVersionService.getLastRequestVersionByRequest(request), RequestStatus.CONSTRUCTION_IN_PROGRESS, userInfo);
            requestStatusHistory.setProposal(proposal);
            proposalRepository.save(proposal);
        }
    }
    
    @Override
    public void rejectProposalByCustomer(String username, UUID proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId).orElseThrow(() -> new NotFoundEntityException("Proposal not found"));
        if (proposal != null) {
            proposal.setCustomerStatus(ProposalStatus.REJECTED);
            Request request = proposal.getRequestVersion().getRequest();
            request.setRequestStatusCustomer(RequestStatus.CONSTRUCTION_REJECTED);
            
            UserInfo userInfo = userInfoService.findByUsername(username);
            RequestStatusHistory requestStatusHistory = requestStatusHistoryService.createNewRequestStatusHistory(requestVersionService.getLastRequestVersionByRequest(request), RequestStatus.CONSTRUCTION_REJECTED, userInfo);
            requestStatusHistory.setProposal(proposal);
            proposalRepository.save(proposal);
        }
    }
}
