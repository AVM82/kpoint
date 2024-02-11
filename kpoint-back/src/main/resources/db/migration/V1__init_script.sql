drop table if exists public.users_tags;
drop table if exists public.user_socials;
drop table if exists public.user_roles;
drop table if exists public.project_entity_networks_links;
drop table if exists public.projects_tags;
drop table if exists public.tags_index;
drop table if exists public.applicants;
drop table if exists public.users_projects_favourite;
drop table if exists public.likes;
drop table if exists public.suggestions;
drop table if exists public.projects;
drop table if exists public.users;

create table if not exists public.applicants (
    id              varchar(36) not null primary key,
    email           varchar(255)
     constraint uk_applicants_email unique,
    username        varchar(255),
    avatar_img_url  varchar(255),
    roles           smallint[]
);

alter table public.applicants owner to postgre_shpp;

create table if not exists public.tags_index (
    name            varchar(10) not null primary key
);

alter table public.tags_index owner to postgre_shpp;

create table if not exists public.users (
    id              varchar(36) not null primary key,
    username        varchar(50) not null
        constraint uk_users_username unique,
    password        varchar(100) not null,
    email           varchar(100) not null
        constraint uk_users_email unique,
    first_name      varchar(50) not null,
    last_name       varchar(50) not null,
    avatar_img_url  varchar(100),
    description     varchar(512),
    deleted         boolean not null default false
);

comment on column public.users.deleted is 'Soft-delete indicator';

alter table public.users owner to postgre_shpp;

create table if not exists public.projects (
    project_id       varchar(36) not null primary key,
    user_id          varchar(36)
       constraint fk_projects_user_id
           references public.users,
    title            varchar(30) not null
       constraint uk_projects_title unique,
    url              varchar(30) not null
       constraint uk_projects_url unique,
    summary          varchar(150) not null,
    description      varchar(512) not null,
    logo_img_url     text,
    latitude         float,
    longitude        float,
    created_at       timestamp(6),
    state            varchar(255),
    owner_sum        integer,
    collected_sum    integer default 0,
    start_sum        integer,
    collect_deadline date,
    goal_sum         integer,
    goal_deadline    date,
    deleted          boolean not null default false
);

alter table public.projects owner to postgre_shpp;

create table if not exists public.project_entity_networks_links (
    project_entity_project_id varchar(36) not null
        constraint fk_project_entity_networks_links_project_entity_project_id
            references public.projects,
    networks_links            varchar(255),
    networks_links_key        varchar(255) not null,
    deleted                   boolean not null default false,
    primary key (project_entity_project_id, networks_links_key)
);

alter table public.project_entity_networks_links owner to postgre_shpp;

create table if not exists public.projects_tags (
    project_entity_project_id varchar(36) not null
        constraint fk_projects_tags_project_entity_project_id
            references public.projects,
    tags_name                 varchar(10) not null
        constraint fk_projects_tags_tags_name
            references public.tags_index,
    deleted                   boolean  not null default false,
    primary key (project_entity_project_id, tags_name)
);

alter table public.projects_tags owner to postgre_shpp;

create table if not exists public.suggestions (
    suggestion_id varchar(36) not null primary key,
    created_at    timestamp(6),
    like_count    integer,
    suggestion    varchar(200) not null,
    user_id       varchar(36)
      constraint fk_suggestions_user_id
          references public.users,
    deleted       boolean  not null default false
);

alter table public.suggestions owner to postgre_shpp;

create table if not exists public.likes (
    id            varchar(36) not null primary key,
    suggestion_id varchar(255)
        constraint fk_likes_suggestion_id
            references public.suggestions,
    user_id       varchar(36)
        constraint fk_likes_user_id
            references public.users,
    deleted       boolean  not null default false
);

alter table public.likes owner to postgre_shpp;

create table if not exists public.user_roles (
    user_id         varchar(36) not null
     constraint fk_user_roles_user_id
         references public.users,
    roles           varchar(255),
    deleted         boolean  not null default false
);

alter table public.user_roles owner to postgre_shpp;

create table if not exists public.user_socials (
    user_id             varchar(36) not null
       constraint fk_user_socials_user_id
           references public.users,
    url                 varchar(255),
    social_networks_key smallint not null,
    deleted             boolean not null default false,
    primary key (user_id, social_networks_key)
);

alter table public.user_socials owner to postgre_shpp;

create table if not exists public.users_projects_favourite (
    user_entity_id                varchar(36) not null
       constraint fk_users_projects_favourite_user_entity_id
           references public.users,
    projects_favourite_project_id varchar(255) not null
       constraint fk_users_projects_favourite_projects_favourite_project_id
           references public.projects,
    deleted                       boolean not null default false,
    primary key (user_entity_id, projects_favourite_project_id)
);

alter table public.users_projects_favourite owner to postgre_shpp;

create table if not exists public.users_tags (
    user_entity_id varchar(36) not null
     constraint fk_users_tags_user_entity_id
         references public.users,
    tags_name      varchar(10) not null
     constraint fk_users_tags_tags_name
         references public.tags_index,
    deleted        boolean not null default false,
    primary key (user_entity_id, tags_name)
);

alter table public.users_tags owner to postgre_shpp;
