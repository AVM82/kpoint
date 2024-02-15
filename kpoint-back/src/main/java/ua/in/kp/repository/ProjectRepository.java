package ua.in.kp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.TagEntity;
import ua.in.kp.entity.UserEntity;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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

    @Query("SELECT DISTINCT p FROM ProjectEntity p LEFT JOIN FETCH p.tags t "
            + "LEFT JOIN FETCH p.networksLinks WHERE t.name IN :tags")
    Set<ProjectEntity> findByTags(List<String> tags);

    @Query("SELECT p FROM ProjectEntity p LEFT JOIN FETCH p.tags t "
            + "LEFT JOIN FETCH p.networksLinks WHERE t IN :tags "
            + "AND p.projectId NOT IN :allProjectIds "
            + "ORDER BY (SELECT COUNT(t2) FROM p.tags t2 WHERE t2 IN :tags) DESC, p.goalSum DESC")
    Page<ProjectEntity> findByTagsExceptOwnedAndFavouriteWithSortByTagsCountThenGoalSum(
            Set<TagEntity> tags, Set<String> allProjectIds, Pageable pageable);

    @EntityGraph(attributePaths = "tags")
    Page<ProjectEntity> findAllByOwner(UserEntity owner, Pageable pageable);
}
