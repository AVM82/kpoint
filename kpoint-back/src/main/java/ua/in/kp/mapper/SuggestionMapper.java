package ua.in.kp.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ua.in.kp.config.MapperConfig;
import ua.in.kp.dto.suggestion.SuggestionCreateRequestDto;
import ua.in.kp.dto.suggestion.SuggestionResponseDto;
import ua.in.kp.entity.LikeEntity;
import ua.in.kp.entity.SuggestionEntity;
import ua.in.kp.entity.UserEntity;

@Mapper(config = MapperConfig.class, uses = {UserMapper.class})
public interface SuggestionMapper {

    @Mapping(target = "user.userId", source = "user.id")
    @Mapping(target = "liked", expression = "java(checkIfLiked(suggestionEntity, user))")
    SuggestionResponseDto toDto(SuggestionEntity suggestionEntity, @Context UserEntity user);

    default boolean checkIfLiked(SuggestionEntity suggestionEntity, UserEntity user) {
        for (LikeEntity likeEntity : suggestionEntity.getLikes()) {
            if (likeEntity.getUser().getId().equals(user.getId())) {
                return true;
            }
        }
        return false;
    }

    SuggestionEntity toEntity(SuggestionCreateRequestDto suggestionCreateRequestDto);

}
