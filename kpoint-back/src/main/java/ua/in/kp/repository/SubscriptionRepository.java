package ua.in.kp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.in.kp.entity.ProjectSubscribeEntity;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<ProjectSubscribeEntity, String> {

    List<ProjectSubscribeEntity> findByProjectId(String id);

    @Query("SELECT p FROM ProjectSubscribeEntity p WHERE p.userId = :userId AND p.projectId = :projectId")
    Optional<ProjectSubscribeEntity> findByUserIdAndProjectId(String userId, String projectId);

    @Query("SELECT p FROM ProjectSubscribeEntity p WHERE p.projectId = :projectId")
    List<ProjectSubscribeEntity> findUserIdsByProjectId(String projectId);
}
