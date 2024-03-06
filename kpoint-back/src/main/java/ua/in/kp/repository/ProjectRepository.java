package ua.in.kp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    Optional<ProjectEntity> findByTitle(String title);

    @Query(value = "SELECT distinct p FROM ProjectEntity p LEFT JOIN FETCH p.tags "
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

    @Query("SELECT p FROM ProjectEntity p LEFT JOIN FETCH p.tags t "
            + "LEFT JOIN FETCH p.networksLinks "
            + "WHERE p.projectId NOT IN :allProjectIds "
            + "ORDER BY p.createdAt DESC")
    Page<ProjectEntity> findAllExceptOwnedAndFavouriteWithSortByCreatedAt(Set<String> allProjectIds, Pageable pageable);

    @Query(value = """
             SELECT DISTINCT pe1_0.*,
                             (SELECT COUNT(t2_0.tags_name)
                              FROM public.projects_tags t2_0
                              WHERE pe1_0.project_id = t2_0.project_entity_project_id
                                AND t2_0.tags_name IN (SELECT tags_name
                                                       FROM public.users_tags
                                                       WHERE user_entity_id = :userId
                                                         AND NOT deleted)
                                AND NOT t2_0.deleted) AS tagsSort
             FROM public.projects pe1_0
                      LEFT JOIN public.projects_tags t1_0 ON pe1_0.project_id = t1_0.project_entity_project_id
                      LEFT JOIN public.tags_index t1_1 ON t1_1.name = t1_0.tags_name
             WHERE t1_0.tags_name IN (SELECT tags_name
                                      FROM public.users_tags
                                      WHERE user_entity_id = :userId
                                        AND NOT deleted)
               AND pe1_0.user_id <> :userId
               AND pe1_0.project_id NOT IN (SELECT project_id
                                            FROM public.project_subscriptions
                                            WHERE user_id = :userId)
               AND NOT pe1_0.deleted
             UNION DISTINCT
             (SELECT DISTINCT pe1_0.*,
                              (SELECT COUNT(t2_0.tags_name)
                               FROM public.projects_tags t2_0
                               WHERE pe1_0.project_id = t2_0.project_entity_project_id
                                 AND t2_0.tags_name IN (SELECT tags_name
                                                        FROM public.users_tags
                                                        WHERE user_entity_id = :userId
                                                          AND NOT deleted)
                                 AND NOT t2_0.deleted)
              FROM projects pe1_0
                       LEFT JOIN public.projects_tags t1_0 ON pe1_0.project_id = t1_0.project_entity_project_id
                       LEFT JOIN public.tags_index t1_1 ON t1_1.name = t1_0.tags_name
              WHERE t1_0.tags_name NOT IN (SELECT tags_name
                                           FROM public.users_tags
                                           WHERE user_entity_id = :userId
                                             AND NOT deleted)
                AND pe1_0.user_id <> :userId
                AND pe1_0.project_id NOT IN (SELECT project_id
                                             FROM public.project_subscriptions
                                             WHERE user_id = :userId)
                AND NOT pe1_0.deleted)
             ORDER BY tagsSort DESC, goal_sum DESC, created_at DESC;
             
            """, nativeQuery = true, countQuery = """
             SELECT DISTINCT pe1_0.*,
                             (SELECT COUNT(t2_0.tags_name)
                              FROM public.projects_tags t2_0
                              WHERE pe1_0.project_id = t2_0.project_entity_project_id
                                AND t2_0.tags_name IN (SELECT tags_name
                                                       FROM public.users_tags
                                                       WHERE user_entity_id = :userId
                                                         AND NOT deleted)
                                AND NOT t2_0.deleted) AS tagsSort
             FROM public.projects pe1_0
                      LEFT JOIN public.projects_tags t1_0 ON pe1_0.project_id = t1_0.project_entity_project_id
                      LEFT JOIN public.tags_index t1_1 ON t1_1.name = t1_0.tags_name
             WHERE t1_0.tags_name IN (SELECT tags_name
                                      FROM public.users_tags
                                      WHERE user_entity_id = :userId
                                        AND NOT deleted)
               AND pe1_0.user_id <> :userId
               AND pe1_0.project_id NOT IN (SELECT project_id
                                            FROM public.project_subscriptions
                                            WHERE user_id = :userId)
               AND NOT pe1_0.deleted
             UNION
             DISTINCT
             (SELECT DISTINCT pe1_0.*,
                              (SELECT COUNT(t2_0.tags_name)
                               FROM public.projects_tags t2_0
                               WHERE pe1_0.project_id = t2_0.project_entity_project_id
                                 AND t2_0.tags_name IN (SELECT tags_name
                                                        FROM public.users_tags
                                                        WHERE user_entity_id = :userId
                                                          AND NOT deleted)
                                 AND NOT t2_0.deleted)
              FROM projects pe1_0
                       LEFT JOIN public.projects_tags t1_0 ON pe1_0.project_id = t1_0.project_entity_project_id
                       LEFT JOIN public.tags_index t1_1 ON t1_1.name = t1_0.tags_name
              WHERE t1_0.tags_name NOT IN (SELECT tags_name
                                           FROM public.users_tags
                                           WHERE user_entity_id = :userId
                                             AND NOT deleted)
                AND pe1_0.user_id <> :userId
                AND pe1_0.project_id NOT IN (SELECT project_id
                                             FROM public.project_subscriptions
                                             WHERE user_id = :userId)
                AND NOT pe1_0.deleted)
            """)
    Page<ProjectEntity> findByUserIdAndSortByTagsCountThenGoalSumOrSortByCreatedAt(
            @Param("userId") String userId, Pageable pageable);

    @Query("SELECT p FROM ProjectEntity p LEFT JOIN FETCH p.tags t "
            + "LEFT JOIN FETCH p.networksLinks WHERE t IN :tags "
            + "ORDER BY (SELECT COUNT(t2) FROM p.tags t2 WHERE t2 IN :tags) DESC, p.goalSum DESC")
    Page<ProjectEntity> findByTagsWithSortByTagsCountThenGoalSum(
            Set<TagEntity> tags, Pageable pageable);

    @EntityGraph(attributePaths = "tags")
    Page<ProjectEntity> findAllByOwner(UserEntity owner, Pageable pageable);

    @Query("FROM ProjectEntity p LEFT JOIN FETCH p.tags LEFT JOIN FETCH p.networksLinks "
            + "LEFT JOIN FETCH p.tags WHERE p.owner = :owner AND p.projectId=:id")
    Optional<ProjectEntity> findByOwnerAndProjectId(UserEntity owner, @Param("id") String projectId);

    @Query("SELECT p FROM ProjectEntity p WHERE p.projectId IN :projectIds")
    Page<ProjectEntity> findByProjectIds(List<String> projectIds, Pageable pageable);
}
