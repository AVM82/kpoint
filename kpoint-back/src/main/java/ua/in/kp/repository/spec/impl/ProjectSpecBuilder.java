package ua.in.kp.repository.spec.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.repository.spec.SpecBuilder;
import ua.in.kp.repository.spec.SpecProvider;

import java.lang.reflect.Field;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProjectSpecBuilder implements SpecBuilder<ProjectEntity> {
    private final ProjectProviderManager projectProviderManager;

    @Override
    public Specification<ProjectEntity> build(Record params) {
        log.info("build project specification by params {}", params);
        Specification<ProjectEntity> specification = Specification.where(null);
        Field[] fields = params.getClass().getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            SpecProvider<ProjectEntity> provider = projectProviderManager.getProvider(field.getName());
            try {
                String[] fieldValue = (String[]) field.get(params);
                if (fieldValue != null) {
                    specification = specification.and(provider.getSpecification(fieldValue));
                }
            } catch (IllegalAccessException e) {
                log.warn("No access to field " + field + " parameters " + params);
                throw new ApplicationException(HttpStatus.NOT_ACCEPTABLE,
                        "No access to field " + field + " parameters " + params);
            }
        }
        return specification;
    }
}
