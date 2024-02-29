package ua.in.kp.dto.project;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Set;

@Data
public class GetAllProjectsDto {

    private String projectId;

    private String url;

    private String title;

    private String summary;

    private Set<String> tags;

    private String logoImgUrl;

    private String state;

    private int goalSum;

    private String createdAt;

    @JsonProperty("isFollowed")
    private boolean isFollowed;
}
