package swp.group5.swp_interior_project.config.swagger;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "Interior_Project",
                version = "1.0.0",
                description = "SWP391_Interior_Project"
        ),
        servers = {
                @Server(url = "http://localhost:8080", description = "Local Development Server")
        }
)

@SecurityScheme(
        name = "bearer-key",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
@Configuration
public class OpenApiConfig {
        @Bean
        public GroupedOpenApi customApi() {
                return GroupedOpenApi.builder()
                        .group("interior_project")
                        .pathsToMatch("/api/**")
                        .build();
        }
}
