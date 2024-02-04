package ua.in.kp.mapper;

import org.mapstruct.Mapper;
import ua.in.kp.config.MapperConfig;
import ua.in.kp.entity.TagEntity;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(config = MapperConfig.class)
public interface TagMapper {

    default Set<TagEntity> toEntitySet(Set<String> tags) {
        return tags.stream()
                .map(n -> new TagEntity(n.toLowerCase()))
                .collect(Collectors.toSet());
    }

    default Set<String> toStringNameSet(Set<TagEntity> tags) {
        return tags.stream()
                .map(TagEntity::getName)
                .collect(Collectors.toSet());
    }
}
