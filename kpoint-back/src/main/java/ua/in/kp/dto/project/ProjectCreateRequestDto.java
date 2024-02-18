package ua.in.kp.dto.project;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import ua.in.kp.enumeration.SocialNetworkName;
import ua.in.kp.validator.CollectionLength;

import java.util.Map;
import java.util.Set;

@Data
@Slf4j
@AllArgsConstructor
public class ProjectCreateRequestDto {

    @NotBlank
    @Size(max = 30)
    private String title;

    @NotBlank(message = "{project.url.not.blank}")
    @Size(min = 5, max = 30, message = "{project.url.min.max}")
    @Pattern(regexp = "[a-zA-Z0-9-]+", message = "{project.url.pattern}")
    private String url;

    @NotBlank
    @Size(max = 150)
    private String summary;

    @NotBlank(message = "{project.description.not.null}")
    @Size(max = 512, message = "{project.description.max}")
    private String description;

    @NotEmpty(message = "{project.tag.not.null}")
    @CollectionLength(min = 1, max = 5, message = "{project.tag.not.null}")
    private Set<String> tags;

    @DecimalMin(value = "-90.0", message = "{project.latitude.size}")
    @DecimalMax(value = "90.0", message = "{project.latitude.size}")
    @Digits(integer = 3, fraction = 1)
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "{project.longitude.size}")
    @DecimalMax(value = "180.0", message = "{project.longitude.size}")
    @Digits(integer = 4, fraction = 1)
    private Double longitude;

    @PositiveOrZero
    private int ownerSum;

    @PositiveOrZero
    private int collectedSum;

    @PositiveOrZero
    private int startSum;

    @NotNull(message = "{project.collectDeadline.not.null}")
    private String collectDeadline;

    @PositiveOrZero
    private int goalSum;

    @NotNull(message = "{project.goalDeadline.not.null}")
    private String goalDeadline;

    @NotNull
    private Map<SocialNetworkName, String> networksLinks;
}
