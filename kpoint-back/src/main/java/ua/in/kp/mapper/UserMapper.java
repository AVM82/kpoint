package ua.in.kp.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ua.in.kp.config.MapperConfig;
import ua.in.kp.dto.user.UserRegisterRequestDto;
import ua.in.kp.dto.user.UserResponseDto;
import ua.in.kp.entity.UserEntity;

@Mapper(config = MapperConfig.class, uses = TagMapper.class)
public interface UserMapper {

    @Mapping(target = "roles", expression = "java(Set.of(UserRole.USER))")
    UserEntity toEntity(UserRegisterRequestDto dto);

    UserResponseDto toDto(UserEntity user);
}
