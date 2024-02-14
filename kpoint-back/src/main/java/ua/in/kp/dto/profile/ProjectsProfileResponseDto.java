package ua.in.kp.dto.profile;

import org.springframework.data.domain.Page;
import ua.in.kp.dto.project.GetAllProjectsDto;

public record ProjectsProfileResponseDto(
        String userId,
        Page<GetAllProjectsDto> myProjects
) {
}
