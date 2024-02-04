package ua.in.kp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ua.in.kp.enumeration.SocialNetworkName;
import ua.in.kp.enumeration.UserRole;

import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter

public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "username", columnDefinition = "VARCHAR(50)", nullable = false, unique = true)
    private String username;

    @Column(name = "password", columnDefinition = "VARCHAR(100)", nullable = false)
    private String password;

    @Column(name = "email", columnDefinition = "VARCHAR(100)", nullable = false, unique = true)
    private String email;

    @Column(name = "first_name", columnDefinition = "VARCHAR(50)", nullable = false)
    private String firstName;

    @Column(name = "last_name", columnDefinition = "VARCHAR(50)", nullable = false)
    private String lastName;

    @Column(name = "avatar_img_url",
            columnDefinition = "VARCHAR(100)")
    private String avatarImgUrl;

    @Column(name = "description", columnDefinition = "VARCHAR(512)")
    private String description;

    @ManyToMany
    private Set<TagEntity> tags;

    @ElementCollection
    @CollectionTable(name = "user_socials", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyEnumerated
    @Column(name = "url")
    private Map<SocialNetworkName, String> socialNetworks = new EnumMap<>(SocialNetworkName.class);

    @ElementCollection
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    private Set<UserRole> roles = new HashSet<>();

    @OneToMany(mappedBy = "owner")
    private Set<ProjectEntity> projectsOwned;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .toList();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getUsername() {
        return email;
    }
}
