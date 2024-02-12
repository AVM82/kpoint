package ua.in.kp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.in.kp.entity.LikeEntity;
import ua.in.kp.entity.SuggestionEntity;
import ua.in.kp.entity.UserEntity;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {

    boolean existsByUserAndSuggestion(UserEntity user, SuggestionEntity suggestion);

    void deleteBySuggestionAndUser(SuggestionEntity suggestion, UserEntity user);

}
