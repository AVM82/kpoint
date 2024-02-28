package ua.in.kp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.UserEntity;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    @Query("FROM UserEntity u LEFT JOIN FETCH u.roles WHERE u.email=:email")
    Optional<UserEntity> findByEmailFetchRoles(String email);

    @Query(value = "SELECT * FROM public.users AS u "
            + "WHERE u.email=:email AND u.deleted", nativeQuery = true)
    Optional<UserEntity> findBannedUserByEmail(String email);

    @EntityGraph(attributePaths = {"roles", "tags", "socialNetworks", "projectsOwned", "projectsFavourite"})
    Optional<UserEntity> findByEmail(String email);

    @Query("FROM UserEntity u WHERE u.username=:username")
    Optional<UserEntity> findByUsernameFetchNothing(String username);

    @Query(value = "SELECT CASE WHEN count(id) > 0 THEN true ELSE FALSE END "
            + "FROM public.users "
            + "WHERE email=:email", nativeQuery = true)
    boolean existsByEmail(String email);

    @Query(value = "SELECT CASE WHEN count(id) > 0 THEN true ELSE FALSE END "
            + "FROM public.users "
            + "WHERE username=:username", nativeQuery = true)
    boolean existsByUsername(String username);

    @EntityGraph(attributePaths = {"socialNetworks", "roles"})
    Page<UserEntity> findAll(Pageable pageable);

    @Query(value = "SELECT * FROM public.users AS u "
            + "LEFT JOIN kpoint.public.user_roles AS r ON u.id = r.user_id", nativeQuery = true)
    Page<UserEntity> findAllByAdmin(Pageable pageable);

    @Query("FROM UserEntity u LEFT JOIN FETCH u.projectsOwned WHERE u.username=:username")
    Optional<UserEntity> findByUsernameFetchProjectsOwned(String username);

    @Query("SELECT u.projectsFavourite FROM UserEntity u INNER JOIN u.projectsFavourite "
            + "WHERE u.username=:username")
    Page<ProjectEntity> findByUsernameFetchProjectsFavourite(String username, Pageable pageable);

    @Query(value = "SELECT DISTINCT * FROM public.users AS u "
            + "WHERE u.id=:id", nativeQuery = true)
    Optional<UserEntity> findByIdForAdmin(@Param("id") String userId);

    @Modifying
    @Query(value = "UPDATE public.users SET deleted=false WHERE id=:id ;"
            + "UPDATE public.user_roles SET deleted=false WHERE user_id=:id",
            nativeQuery = true)
    int unBanUserByIdForAdmin(@Param("id") String userId);

    @Query("FROM UserEntity u LEFT JOIN FETCH u.tags LEFT JOIN FETCH u.socialNetworks "
            + "WHERE u.username=:username")
    Optional<UserEntity> findByUsernameFetchTagsSocials(String username);
}
