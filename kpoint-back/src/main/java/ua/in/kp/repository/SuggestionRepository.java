package ua.in.kp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.in.kp.entity.SuggestionEntity;

public interface SuggestionRepository extends JpaRepository<SuggestionEntity, String> {
}
