package swp.group5.swp_interior_project.service.interfaces;


import swp.group5.swp_interior_project.model.dto.ProductDto;
import swp.group5.swp_interior_project.model.entity.Product;
import swp.group5.swp_interior_project.model.entity.Workspace;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    ProductDto convertProduct(Product product);
    
    Product convertProduct(ProductDto productDto);
    
    Product getProductById(Long productId);
    
    List<ProductDto> getAllProduct();
    
    boolean addProduct(ProductDto productDto);
    
    void addProduct(ProductDto productDto, Workspace workspace);
    
    void deleteProduct(Long productId);
    
    ProductDto updateProductById(Long productId, ProductDto productDto);
    
    Optional<Product> findById(Long productId);
}
