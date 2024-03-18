package swp.group5.swp_interior_project.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.group5.swp_interior_project.model.dto.request.ProductDetailDto;
import swp.group5.swp_interior_project.model.dto.request.RequestDetailDto;
import swp.group5.swp_interior_project.model.entity.Product;
import swp.group5.swp_interior_project.model.entity.RequestDetail;
import swp.group5.swp_interior_project.model.entity.RequestDetailProduct;
import swp.group5.swp_interior_project.model.entity.RequestVersion;
import swp.group5.swp_interior_project.repository.RequestDetailProductRepository;
import swp.group5.swp_interior_project.repository.RequestDetailRepository;
import swp.group5.swp_interior_project.service.interfaces.ProductService;
import swp.group5.swp_interior_project.service.interfaces.RequestDetailService;
import swp.group5.swp_interior_project.service.interfaces.WorkspaceService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RequestDetailServiceImpl implements RequestDetailService {
    private final RequestDetailRepository requestDetailRepository;
    private final ProductService productService;
    private final WorkspaceService workspaceService;
    private final RequestDetailProductRepository requestDetailProductRepository;
    
    @Autowired
    public RequestDetailServiceImpl(RequestDetailRepository requestDetailRepository, ProductService productService, WorkspaceService workspaceService, RequestDetailProductRepository requestDetailProductRepository) {
        this.requestDetailRepository = requestDetailRepository;
        this.productService = productService;
        this.workspaceService = workspaceService;
        this.requestDetailProductRepository = requestDetailProductRepository;
    }
    
    @Override
    public RequestDetail createRequestDetail(RequestVersion requestVersion, RequestDetailDto requestDetailDto) {
        RequestDetail requestDetail = new RequestDetail();
        requestDetail.setRequestVersion(requestVersion);
        requestDetail.setDescription(requestDetailDto.getDescription());
        requestDetail.setLength(requestDetailDto.getLength());
        requestDetail.setWidth(requestDetailDto.getWidth());
        requestDetail.setArea(requestDetail.getLength().multiply(requestDetail.getWidth()));
        requestDetailRepository.save(requestDetail);
        
        List<RequestDetailProduct> requestDetailProducts = new ArrayList<>();
        for (ProductDetailDto productDetailDto : requestDetailDto.getProducts()) {
            Product product = productService.getProductById(productDetailDto.getProductId());
            RequestDetailProduct requestDetailProduct = new RequestDetailProduct();
            requestDetailProduct.setRequestDetail(requestDetail);
            requestDetailProduct.setProduct(product);
            requestDetailProduct.setQuantity(productDetailDto.getQuantity());
            requestDetailProduct.setDescription(productDetailDto.getDescription());
            // Lưu vào cơ sở dữ liệu
            requestDetailProductRepository.save(requestDetailProduct);
            requestDetailProducts.add(requestDetailProduct);
        }
        requestDetail.setRequestDetailProducts(requestDetailProducts);
        requestDetail.setWorkspace(workspaceService.getWorkspaceByName(requestDetailDto.getWorkspaceName()));
        return requestDetailRepository.save(requestDetail);
    }
    
    @Override
    public RequestDetailDto convertRequestDetail(RequestDetail requestDetail) {
        RequestDetailDto requestDetailDto = new RequestDetailDto();
        requestDetailDto.setId(requestDetail.getId());
        requestDetailDto.setRequestVersionId(requestDetail.getRequestVersion().getId());
        requestDetailDto.setDescription(requestDetail.getDescription());
        requestDetailDto.setWorkspaceName(requestDetail.getWorkspace().getWorkspaceName());
        requestDetailDto.setLength(requestDetail.getLength());
        requestDetailDto.setWidth(requestDetail.getWidth());
        
        // Khởi tạo danh sách chứa thông tin về sản phẩm
        List<ProductDetailDto> productDetailDtoList = new ArrayList<>();
        for (RequestDetailProduct requestDetailProduct : requestDetail.getRequestDetailProducts()) {
            ProductDetailDto productDetailDto = new ProductDetailDto();
            productDetailDto.setProductId(requestDetailProduct.getProduct().getId());
            productDetailDto.setQuantity(requestDetailProduct.getQuantity());
            productDetailDto.setDescription(requestDetailProduct.getDescription());
            productDetailDtoList.add(productDetailDto);
        }
        requestDetailDto.setProducts(productDetailDtoList);
        
        return requestDetailDto;
    }
    
    @Override
    public RequestDetail convertRequestDetail(RequestDetailDto requestDetailDto) {
        RequestDetail requestDetail = new RequestDetail();
        requestDetail.setWorkspace(workspaceService.getWorkspaceByName(requestDetailDto.getWorkspaceName()));
        requestDetail.setDescription(requestDetailDto.getDescription());
        requestDetail.setLength(requestDetailDto.getLength());
        requestDetail.setWidth(requestDetailDto.getWidth());
        
        for (ProductDetailDto productDetailDto : requestDetailDto.getProducts()) {
            Product product = productService.getProductById(productDetailDto.getProductId());
            RequestDetailProduct requestDetailProduct = new RequestDetailProduct();
            requestDetailProduct.setProduct(product);
            requestDetailProduct.setQuantity(productDetailDto.getQuantity());
            requestDetailProduct.setDescription(productDetailDto.getDescription());
            requestDetail.getRequestDetailProducts().add(requestDetailProduct);
        }
        
        return requestDetail;
    }
    
    @Override
    public List<RequestDetail> updateRequestDetailOfRequestVersion(RequestVersion requestVersion, List<RequestDetailDto> updateRequestDetailList) {
        // Get the list of current request details of the request version
        List<RequestDetail> existingRequestDetails = requestDetailRepository.findByRequestVersion(requestVersion);
        
        // Initialize a list to store updated or newly created request details
        List<RequestDetail> updatedRequestDetails = new ArrayList<>();
        
        // Iterate through the list of request details updated from DTO
        for (RequestDetailDto updateRequestDetailDto : updateRequestDetailList) {
            // Check if the request detail exists in the current list
            Optional<RequestDetail> existingDetailOptional = existingRequestDetails.stream()
                    .filter(detail -> detail.getRequestVersion().equals(requestVersion) && detail.getRequestDetailProducts().stream()
                            .anyMatch(product -> product.getProduct().getId().equals(updateRequestDetailDto.getProducts().getFirst().getProductId())))
                    .findFirst();
            
            // If the request detail exists, update the product information
            existingDetailOptional.ifPresent(existingDetail -> {
                // Get the corresponding product in the request detail's product list
                RequestDetailProduct matchedProduct = existingDetail.getRequestDetailProducts().stream()
                        .filter(product -> product.getProduct().getId().equals(updateRequestDetailDto.getProducts().getFirst().getProductId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Product not found in existing request detail"));
                // Update the product information
                matchedProduct.setDescription(updateRequestDetailDto.getProducts().getFirst().getDescription());
                matchedProduct.setQuantity(updateRequestDetailDto.getProducts().getFirst().getQuantity());
                // Add the request detail to the update list
                updatedRequestDetails.add(existingDetail);
            });
            
            // If the request detail does not exist, create a new one and add to the update list
            existingDetailOptional.orElseGet(() -> {
                RequestDetail newRequestDetail = convertRequestDetail(updateRequestDetailDto);
                newRequestDetail.setRequestVersion(requestVersion);
                updatedRequestDetails.add(newRequestDetail);
                return newRequestDetail;
            });
        }
        
        // Save the new request details to the database
        List<RequestDetail> savedRequestDetails = requestDetailRepository.saveAll(updatedRequestDetails);
        
        // Remove the request details that no longer exist in the current list
        existingRequestDetails.removeIf(existingDetail ->
                updateRequestDetailList.stream()
                        .noneMatch(requestDetailDto -> requestDetailDto.getProducts().getFirst().getProductId().equals(existingDetail.getRequestDetailProducts().getFirst().getProduct().getId()))
        );
        requestDetailRepository.deleteAll(existingRequestDetails);
        
        // Return the list of request details of the request version after updating
        return savedRequestDetails;
    }
    
}
