package ua.in.kp.repository.spec.impl;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.repository.spec.SpecProvider;

@Component
public class ProjectTitleSpecProvider implements SpecProvider<ProjectEntity> {
    @Override
    public String getName() {
        return "title";
    }

    @Override
    public Specification<ProjectEntity> getSpecification(String[] params) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            for (String param : params) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")),
                                "%" + param.toLowerCase() + "%"));
            }
            return predicate;
        };
    }
}
