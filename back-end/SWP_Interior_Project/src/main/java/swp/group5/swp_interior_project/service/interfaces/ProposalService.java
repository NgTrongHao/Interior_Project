package swp.group5.swp_interior_project.service.interfaces;

import swp.group5.swp_interior_project.model.dto.ProposalDto;
import swp.group5.swp_interior_project.model.entity.Proposal;

import java.util.UUID;

public interface ProposalService {
    UUID saveProposal(UUID requestId, String username, ProposalDto proposalDto);
    
    ProposalDto convertProposal(Proposal proposal);
    
    void confirmProposal(String username, UUID proposalId);
    
    void rejectProposal(String username, UUID proposalId);
    
    void confirmProposalByCustomer(String username, UUID proposalId);
    
    void rejectProposalByCustomer(String username, UUID proposalId);
}
