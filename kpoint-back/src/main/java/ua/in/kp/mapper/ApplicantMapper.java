package ua.in.kp.mapper;

import org.mapstruct.Mapper;
import ua.in.kp.config.MapperConfig;
import ua.in.kp.dto.user.ApplicantResponseDto;
import ua.in.kp.entity.ApplicantEntity;

@Mapper(config = MapperConfig.class)
public interface ApplicantMapper {

    ApplicantResponseDto toDto(ApplicantEntity entity);

}
