package ua.in.kp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.in.kp.entity.ProjectEntity;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<ProjectEntity, String> {

    @Query("FROM ProjectEntity p LEFT JOIN FETCH p.tags "
            + "LEFT JOIN FETCH p.networksLinks WHERE p.projectId=:id")
    Optional<ProjectEntity> findBy(String id);

    @Query("FROM ProjectEntity p LEFT JOIN FETCH p.tags "
            + "LEFT JOIN FETCH p.networksLinks WHERE p.url=:url")
    Optional<ProjectEntity> findByProjectUrl(String url);

    @Query("FROM ProjectEntity p LEFT JOIN FETCH p.tags "
            + "LEFT JOIN FETCH p.networksLinks")
    Page<ProjectEntity> findAll(Pageable pageable);
}
