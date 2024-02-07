package ua.in.kp.repository;

import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.in.kp.entity.ProjectEntity;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ProjectRepository extends JpaRepository<ProjectEntity, String> {

    @Query("FROM ProjectEntity p LEFT JOIN FETCH p.tags "
            + "LEFT JOIN FETCH p.networksLinks WHERE p.projectId=:id")
    Optional<ProjectEntity> findBy(String id);

    @Query("FROM ProjectEntity p LEFT JOIN FETCH p.tags "
            + "LEFT JOIN FETCH p.networksLinks")
    Page<ProjectEntity> findAll(Pageable pageable);

    @Query("SELECT DISTINCT p FROM ProjectEntity p LEFT JOIN FETCH p.tags t "
            + "LEFT JOIN FETCH p.networksLinks WHERE t.name IN :tags")
    Set<ProjectEntity> findByTags(List<String> tags);

    @Query("SELECT DISTINCT p FROM ProjectEntity p LEFT JOIN FETCH p.tags t "
            + "LEFT JOIN FETCH p.networksLinks WHERE t.name IN :tags "
            + "AND p.projectId NOT IN :ownedProjectUUIDs AND p.projectId NOT IN :favouriteProjectUUIDs")
    Page<ProjectEntity> findByTagsExceptOwnedAndFavourite(
            Set<String> tags, Set<String> ownedProjectUUIDs, Set<String> favouriteProjectUUIDs, Pageable pageable);
}
