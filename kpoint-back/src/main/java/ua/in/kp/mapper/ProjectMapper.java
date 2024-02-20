package ua.in.kp.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ua.in.kp.config.MapperConfig;
import ua.in.kp.dto.project.GetAllProjectsDto;
import ua.in.kp.dto.project.ProjectCreateRequestDto;
import ua.in.kp.dto.project.ProjectResponseDto;
import ua.in.kp.dto.project.ProjectSubscribeDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.ProjectSubscribeEntity;

@Mapper(config = MapperConfig.class, uses = TagMapper.class)
public interface ProjectMapper {

    @Mapping(target = "collectDeadline", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "goalDeadline", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "owner.ownerId", source = "owner.id")
    ProjectResponseDto toDto(ProjectEntity projectEntity);

    @Mapping(target = "latitude", source = "latitude", defaultValue = "49.1")
    @Mapping(target = "longitude", source = "longitude", defaultValue = "32.5")
    ProjectEntity toEntity(ProjectCreateRequestDto projectDto);

    GetAllProjectsDto getAllToDto(ProjectEntity projectEntity);

    ProjectSubscribeDto toDtoSubscribe(ProjectSubscribeEntity subscribeEntity);
}
