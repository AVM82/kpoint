package ua.in.kp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.in.kp.entity.SuggestionEntity;

public interface SuggestionRepository extends JpaRepository<SuggestionEntity, String> {
    @Query("FROM SuggestionEntity s LEFT JOIN FETCH s.likes")
    Page<SuggestionEntity> findAll(Pageable pageable);
}
