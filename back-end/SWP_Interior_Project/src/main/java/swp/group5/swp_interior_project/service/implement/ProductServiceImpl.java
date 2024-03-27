package swp.group5.swp_interior_project.service.implement;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.group5.swp_interior_project.exception.DuplicateEntityException;
import swp.group5.swp_interior_project.exception.NotFoundEntityException;
import swp.group5.swp_interior_project.model.dto.ProductDto;
import swp.group5.swp_interior_project.model.entity.Product;
import swp.group5.swp_interior_project.model.entity.Workspace;
import swp.group5.swp_interior_project.repository.ProductRepository;
import swp.group5.swp_interior_project.service.interfaces.ProductService;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    
    @Autowired
    public ProductServiceImpl(ProductRepository productRepository, ModelMapper modelMapper) {
        this.productRepository = productRepository;
        this.modelMapper = modelMapper;
    }
    
    @Override
    public ProductDto convertProduct(Product product) {
        return modelMapper.map(product, ProductDto.class);
    }
    
    @Override
    public Product convertProduct(ProductDto productDto) {
        Product product = new Product();
        if (productDto.getId() != null) {
            product.setId(product.getId());
        }
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        return product;
    }
    
    @Override
    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(null);
    }
    
    @Override
    public List<ProductDto> getAllProduct() {
        return null;
    }
    
    @Override
    public boolean addProduct(ProductDto productDto) {
        if (productRepository.existsByIdOrName(productDto.getId(), productDto.getName())) {
            throw new DuplicateEntityException("Product with the same id or name already exists");
        }
        productRepository.save(convertProduct(productDto));
        return true;
    }
    
    @Override
    public void addProduct(ProductDto productDto, Workspace workspace) {
        if (productRepository.existsByIdOrName(productDto.getId(), productDto.getName())) {
            throw new DuplicateEntityException("Product with the same id or name already exists");
        }
        Product newProduct = convertProduct(productDto);
        newProduct.setWorkspace(workspace);
        productRepository.save(newProduct);
    }
    
    @Override
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new NotFoundEntityException("Product not found"));
        productRepository.delete(product);
    }
    
    @Override
    public ProductDto updateProductById(Long productId, ProductDto productDto) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new NotFoundEntityException("Product not found"));
        if (!productDto.getName().equals(product.getName()) && !productRepository.existsByName(productDto.getName())) {
            product.setName(productDto.getName());
        }
        product.setPrice(productDto.getPrice());
        product.setDescription(productDto.getDescription());
        return convertProduct(product);
    }
    
    @Override
    public Optional<Product> findById(Long productId) {
        return productRepository.findById(productId);
    }
}
