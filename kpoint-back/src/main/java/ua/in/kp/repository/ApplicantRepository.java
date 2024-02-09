package ua.in.kp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.in.kp.entity.ApplicantEntity;

import java.util.Optional;

public interface ApplicantRepository extends JpaRepository<ApplicantEntity, String> {
    Optional<ApplicantEntity> findByEmail(String email);
}
