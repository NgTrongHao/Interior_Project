package swp.group5.swp_interior_project.service.implement;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.group5.swp_interior_project.exception.DuplicateEntityException;
import swp.group5.swp_interior_project.exception.NotFoundEntityException;
import swp.group5.swp_interior_project.model.dto.ProductDto;
import swp.group5.swp_interior_project.model.dto.WorkspaceDto;
import swp.group5.swp_interior_project.model.entity.Workspace;
import swp.group5.swp_interior_project.repository.WorkspaceRepository;
import swp.group5.swp_interior_project.service.interfaces.ProductService;
import swp.group5.swp_interior_project.service.interfaces.WorkspaceService;

import java.util.List;

@Service
public class WorkspaceServiceImpl implements WorkspaceService {
    private final WorkspaceRepository workspaceRepository;
    private final ProductService productService;
    private final ModelMapper modelMapper;
    
    @Autowired
    public WorkspaceServiceImpl(WorkspaceRepository workspaceRepository, ProductServiceImpl productService, ModelMapper modelMapper) {
        this.workspaceRepository = workspaceRepository;
        this.productService = productService;
        this.modelMapper = modelMapper;
    }
    
    @Override
    public WorkspaceDto convertWorkspace(Workspace workspace) {
        WorkspaceDto workspaceDto = new WorkspaceDto();
        workspaceDto.setId(workspace.getId());
        workspaceDto.setWorkspaceName(workspace.getWorkspaceName());
        workspaceDto.setProductList(workspace.getProducts().stream()
                .map(productService::convertProduct)
                .toList()
        );
        return workspaceDto;
    }
    
    @Override
    public Workspace convertWorkspace(WorkspaceDto workspaceDto) {
        return modelMapper.map(workspaceDto, Workspace.class);
    }
    
    @Override
    public Workspace getWorkspaceByName(String workspaceName) {
        return workspaceRepository.findByWorkspaceName(workspaceName)
                .orElseThrow(null);
    }
    
    @Override
    public List<WorkspaceDto> getAllWorkspace() {
        return workspaceRepository.findAll().stream()
                .map(this::convertWorkspace).toList();
    }
    
    @Override
    public WorkspaceDto addProductToWorkspace(String workspaceName, ProductDto productDto) {
        return workspaceRepository.findByWorkspaceName(workspaceName)
                .map(workspace -> {
                    productService.addProduct(productDto, workspace);
                    return convertWorkspace(workspaceRepository.save(workspace));
                })
                .orElseThrow(() -> new NotFoundEntityException("Workspace not found"));
    }
    
    @Override
    public void addWorkspace(WorkspaceDto workspaceDto) {
        System.out.println(workspaceDto);
        if(workspaceRepository.existsByWorkspaceName(workspaceDto.getWorkspaceName())) {
            throw new DuplicateEntityException("Workspace already exist");
        }
        workspaceRepository.save(convertWorkspace(workspaceDto));
    }
    
    @Override
    public List<ProductDto> getAllProductsByWorkspaceName(String workspaceName) {
        Workspace workspace = workspaceRepository.findByWorkspaceName(workspaceName).orElseThrow(()-> new NotFoundEntityException("Workspace not found"));
        return workspace.getProducts().stream().map(productService::convertProduct).toList();
    }
}
