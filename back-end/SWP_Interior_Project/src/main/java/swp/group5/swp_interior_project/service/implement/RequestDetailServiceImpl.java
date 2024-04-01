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
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

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
            RequestDetailProduct requestDetailProduct = getRequestDetailProduct(productDetailDto, requestDetail, product);
            // Lưu vào cơ sở dữ liệu
            requestDetailProductRepository.save(requestDetailProduct);
            requestDetailProducts.add(requestDetailProduct);
        }
        requestDetail.setRequestDetailProducts(requestDetailProducts);
        requestDetail.setWorkspace(workspaceService.getWorkspaceByName(requestDetailDto.getWorkspaceName()));
        return requestDetailRepository.save(requestDetail);
    }
    
    private static RequestDetailProduct getRequestDetailProduct(ProductDetailDto productDetailDto, RequestDetail requestDetail, Product product) {
        RequestDetailProduct requestDetailProduct = new RequestDetailProduct();
        requestDetailProduct.setRequestDetail(requestDetail);
        requestDetailProduct.setProduct(product);
        requestDetailProduct.setQuantity(productDetailDto.getQuantity());
        requestDetailProduct.setLength(productDetailDto.getLength());
        requestDetailProduct.setWidth(productDetailDto.getWidth());
        requestDetailProduct.setHeight(productDetailDto.getHeight());
        requestDetailProduct.setDescription(productDetailDto.getDescription());
        return requestDetailProduct;
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
        
        List<ProductDetailDto> productDetailDtoList = getProductDetailDtoList(requestDetail);
        requestDetailDto.setProducts(productDetailDtoList);
        
        return requestDetailDto;
    }
    
    private List<ProductDetailDto> getProductDetailDtoList(RequestDetail requestDetail) {
        List<ProductDetailDto> productDetailDtoList = new ArrayList<>();
        for (RequestDetailProduct requestDetailProduct : requestDetail.getRequestDetailProducts()) {
            ProductDetailDto productDetailDto = new ProductDetailDto();
            productDetailDto.setProductId(requestDetailProduct.getProduct().getId());
            productDetailDto.setProductName(requestDetailProduct.getProduct().getName());
            productDetailDto.setQuantity(requestDetailProduct.getQuantity());
            productDetailDto.setLength(requestDetailProduct.getLength());
            productDetailDto.setWidth(requestDetailProduct.getWidth());
            productDetailDto.setHeight(requestDetailProduct.getHeight());
            productDetailDto.setDescription(requestDetailProduct.getDescription());
            productDetailDtoList.add(productDetailDto);
        }
        return productDetailDtoList;
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
        
        // Initialize a map to store existing request details by their IDs
        Map<Long, RequestDetail> existingRequestDetailMap = existingRequestDetails.stream()
                .collect(Collectors.toMap(RequestDetail::getId, Function.identity()));
        
        // Initialize a list to store updated or newly created request details
        List<RequestDetail> updatedRequestDetails = new ArrayList<>();
        
        // Loop through the updated request detail DTOs
        for (RequestDetailDto updateRequestDetailDto : updateRequestDetailList) {
            // Check if the update request detail has an ID
            if (updateRequestDetailDto.getId() != null) {
                Long updateRequestId = updateRequestDetailDto.getId();
                // Check if the update request detail exists in the existing details
                if (existingRequestDetailMap.containsKey(updateRequestId)) {
                    // Update the existing request detail
                    RequestDetail existingRequestDetail = existingRequestDetailMap.get(updateRequestId);
                    updateRequestDetail(existingRequestDetail, updateRequestDetailDto);
                    updatedRequestDetails.add(existingRequestDetail);
                    // Remove the updated detail from the map
                    existingRequestDetailMap.remove(updateRequestId);
                    continue;
                }
            }
            
            // Find the most appropriate existing request detail for updating
            RequestDetail existingRequestDetail = findMostAppropriateExistingDetail(existingRequestDetailMap, updateRequestDetailDto);
            if (existingRequestDetail != null) {
                updateRequestDetail(existingRequestDetail, updateRequestDetailDto);
                updatedRequestDetails.add(existingRequestDetail);
                // Remove the updated detail from the map
                existingRequestDetailMap.remove(existingRequestDetail.getId());
            } else {
                // Create a new request detail
                RequestDetail newRequestDetail = new RequestDetail();
                newRequestDetail.setWorkspace(workspaceService.getWorkspaceByName(updateRequestDetailDto.getWorkspaceName()));
                newRequestDetail.setRequestVersion(requestVersion);
                requestDetailRepository.save(newRequestDetail);
                updateRequestDetail(newRequestDetail, updateRequestDetailDto);
                updatedRequestDetails.add(newRequestDetail);
            }
        }
        
        // Save the updated or newly created request details
        List<RequestDetail> savedRequestDetails = requestDetailRepository.saveAll(updatedRequestDetails);
        
        // Delete the request details that are no longer in the update list
        List<RequestDetail> detailsToDelete = new ArrayList<>(existingRequestDetailMap.values());
        requestDetailRepository.deleteAll(detailsToDelete);
        
        // Return the list of updated or newly created request details
        return savedRequestDetails;
    }
    
    private void updateRequestDetail(RequestDetail requestDetail, RequestDetailDto updateRequestDetailDto) {
        // Update properties needed
        requestDetail.setDescription(updateRequestDetailDto.getDescription());
        requestDetail.setLength(updateRequestDetailDto.getLength());
        requestDetail.setWidth(updateRequestDetailDto.getWidth());
        
        // Update or add products
        // Store the list of newly updated RequestDetailProducts
        List<RequestDetailProduct> updatedProducts = new ArrayList<>();
        
        // Create a Map to store RequestDetailProducts by productId
        Map<Long, RequestDetailProduct> existingProductsMap = requestDetail.getRequestDetailProducts().stream()
                .collect(Collectors.toMap(product -> product.getProduct().getId(), Function.identity()));
        
        // Loop through the ProductDetailDtoList in updateRequestDetailDto
        for (ProductDetailDto productDto : updateRequestDetailDto.getProducts()) {
            Long productId = productDto.getProductId();
            RequestDetailProduct existingProduct = existingProductsMap.get(productId);
            if (existingProduct != null) {
                // Update information for existing RequestDetailProduct
                existingProduct.setQuantity(productDto.getQuantity());
                existingProduct.setLength(productDto.getLength());
                existingProduct.setWidth(productDto.getWidth());
                existingProduct.setHeight(productDto.getHeight());
                existingProduct.setDescription(productDto.getDescription());
                updatedProducts.add(existingProduct);
            } else {
                // Create a new RequestDetailProduct if not existing
                Product product = productService.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));
                RequestDetailProduct newProduct = new RequestDetailProduct();
                newProduct.setProduct(product);
                newProduct.setQuantity(productDto.getQuantity());
                newProduct.setLength(productDto.getLength());
                newProduct.setWidth(productDto.getWidth());
                newProduct.setHeight(productDto.getHeight());
                newProduct.setDescription(productDto.getDescription());
                newProduct.setRequestDetail(requestDetail);
                updatedProducts.add(requestDetailProductRepository.save(newProduct));
            }
        }
        
        // Delete RequestDetailProducts that are no longer needed
        List<RequestDetailProduct> productsToDelete = new ArrayList<>();
        for (RequestDetailProduct existingProduct : requestDetail.getRequestDetailProducts()) {
            if (!updatedProducts.contains(existingProduct)) {
                productsToDelete.add(existingProduct);
            }
        }
        
        // Remove RequestDetailProducts that no longer exist in the update list
        requestDetail.getRequestDetailProducts().removeIf(product -> !updatedProducts.contains(product));
        
        requestDetailProductRepository.deleteAll(productsToDelete);
        
        // Update the RequestDetail's list of RequestDetailProducts
        requestDetail.setRequestDetailProducts(updatedProducts);
    }
    
    private RequestDetail findMostAppropriateExistingDetail(Map<Long, RequestDetail> existingDetailMap, RequestDetailDto updateRequestDetailDto) {
        // Loop through existing request details
        for (RequestDetail existingRequestDetail : existingDetailMap.values()) {
            // Check if the workspace of the existing request detail matches the workspace of the update request detail
            if (existingRequestDetail.getWorkspace().getWorkspaceName().equals(updateRequestDetailDto.getWorkspaceName())) {
                // Return the first matching request detail found
                return existingRequestDetail;
            }
        }
        // If no matching request detail is found, return null
        return null;
    }
    
}
