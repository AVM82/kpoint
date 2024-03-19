package ua.in.kp.repository.spec;

import org.springframework.data.jpa.domain.Specification;

public interface SpecBuilder<T> {
    Specification<T> build(Record params);
}
