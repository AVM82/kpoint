package ua.in.kp.repository.spec;

import org.springframework.data.jpa.domain.Specification;

public interface SpecProvider<T> {
    String getName();

    Specification<T> getSpecification(String[] params);
}
