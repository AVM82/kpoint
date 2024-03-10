package ua.in.kp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.in.kp.entity.ProjectSubscribeEntity;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<ProjectSubscribeEntity, String> {

    List<ProjectSubscribeEntity> findByProjectProjectId(String id);

    @Query("SELECT p FROM ProjectSubscribeEntity p WHERE p.user.id = :userId AND p.project.projectId = :projectId")
    Optional<ProjectSubscribeEntity> findByUserIdAndProjectId(String userId, String projectId);

    @Query("SELECT p FROM ProjectSubscribeEntity p WHERE p.project.projectId = :projectId")
    List<ProjectSubscribeEntity> findUserIdsByProjectId(String projectId);

    Page<ProjectSubscribeEntity> findByUserId(String userId, Pageable pageable);

    boolean existsByUserIdAndProjectProjectId(String userId, String projectId);
}
