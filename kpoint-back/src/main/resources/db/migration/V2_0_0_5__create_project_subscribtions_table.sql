drop table if exists public.project_subscriptions;
drop table if exists public.project_subscription;

create table if not exists public.project_subscriptions
(
    id         varchar(36) not null primary key,
    user_id    varchar(255) not null,
    project_id varchar(255) not null
);

alter table project_subscriptions add column deleted boolean default false;