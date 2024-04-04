package swp.group5.swp_interior_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.group5.swp_interior_project.model.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByIdOrName(Long id, String name);
    
    boolean existsByName(String name);
    
    Product findByName(String name);
}
