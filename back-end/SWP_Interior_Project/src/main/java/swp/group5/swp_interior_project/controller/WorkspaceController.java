package swp.group5.swp_interior_project.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.group5.swp_interior_project.model.dto.ProductDto;
import swp.group5.swp_interior_project.model.dto.WorkspaceDto;
import swp.group5.swp_interior_project.service.interfaces.WorkspaceService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workspace")
public class WorkspaceController {
    
    private final WorkspaceService workspaceService;
    
    @Autowired
    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }
    
    // Endpoint to get all workspaces
    /**
     * API Endpoint: /api/v1/workspace
     * Method: GET
     * Description: Get a list of all workspaces.
     * Input Parameters: None
     * Expected Output: A list of workspace data (WorkspaceDto).
     */
    @GetMapping
    public ResponseEntity<List<WorkspaceDto>> getAllWorkspace() {
        return ResponseEntity.ok(workspaceService.getAllWorkspace());
    }
    
    // Endpoint to get all products by workspace name
    /**
     * API Endpoint: /api/v1/workspace/{workspaceName}/products
     * Method: GET
     * Description: Get a list of all products associated with a specific workspace.
     * Input Parameters: workspaceName (String) - Name of the workspace (path variable).
     * Expected Output: A list of product data (ProductDto) associated with the workspace.
     */
    @GetMapping("/{workspaceName}/products")
    public List<ProductDto> getAllProductsByWorkspaceName(@PathVariable String workspaceName) {
        return workspaceService.getAllProductsByWorkspaceName(workspaceName);
    }
    
    // Endpoint to add a product to a workspace
    /**
     * API Endpoint: /api/v1/workspace/{workspaceName}/products
     * Method: POST
     * Description: Add a new product to a specific workspace.
     * Input Parameters:
     *    workspaceName (String) - Name of the workspace (path variable).
     *    productDto (ProductDto) - Data of the product to be added (request body).
     * Expected Output: Updated workspace data (WorkspaceDto) with the new product added.
     */
    @PostMapping("/{workspaceName}/products")
    public ResponseEntity<WorkspaceDto> addProductToWorkspace(
            @PathVariable String workspaceName,
            @Valid @RequestBody ProductDto productDto) {
        WorkspaceDto updatedWorkspace = workspaceService.addProductToWorkspace(workspaceName, productDto);
        return new ResponseEntity<>(updatedWorkspace, HttpStatus.CREATED);
    }
    
    // Endpoint to add a new workspace
    /**
     * API Endpoint: /api/v1/workspace/addWorkspace
     * Method: POST
     * Description: Add a new workspace to the system.
     * Input Parameters: Workspace data (WorkspaceDto) for the new workspace (request body).
     * Expected Output: A list of all workspaces including the newly added one (WorkspaceDto).
     */
    @PostMapping("/addWorkspace")
    public ResponseEntity<List<WorkspaceDto>> addWorkspace(
            @Valid @RequestBody WorkspaceDto workspaceDto
    ) {
        workspaceService.addWorkspace(workspaceDto);
        return ResponseEntity.ok(workspaceService.getAllWorkspace());
    }
}
