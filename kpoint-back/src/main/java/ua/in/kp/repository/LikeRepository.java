package ua.in.kp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.in.kp.entity.LikeEntity;
import ua.in.kp.entity.SuggestionEntity;
import ua.in.kp.entity.UserEntity;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    Optional<LikeEntity> findByUserAndSuggestion(UserEntity user, SuggestionEntity suggestion);

    int countAllBySuggestionId(String suggestionId);

    void deleteAllBySuggestionId(String suggestionId);
}
