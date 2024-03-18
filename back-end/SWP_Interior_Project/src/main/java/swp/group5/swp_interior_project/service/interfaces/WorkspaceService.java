package swp.group5.swp_interior_project.service.interfaces;

import swp.group5.swp_interior_project.model.dto.ProductDto;
import swp.group5.swp_interior_project.model.dto.WorkspaceDto;
import swp.group5.swp_interior_project.model.entity.Workspace;

import java.util.List;

public interface WorkspaceService {
    WorkspaceDto convertWorkspace(Workspace workspace);
    
    Workspace convertWorkspace(WorkspaceDto workspaceDto);
    
    Workspace getWorkspaceByName(String workspaceName);
    
    List<WorkspaceDto> getAllWorkspace();
    
    WorkspaceDto addProductToWorkspace(String workspaceName, ProductDto productDto);
    
    void addWorkspace(WorkspaceDto workspaceDto);
    
    List<ProductDto> getAllProductsByWorkspaceName(String workspaceName);
}
