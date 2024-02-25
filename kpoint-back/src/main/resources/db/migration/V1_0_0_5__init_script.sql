drop table if exists public.project_subscriptions;

create table if not exists public.project_subscription
(
    id         varchar(36) not null primary key,
    user_id    varchar(255) not null,
    project_id varchar(255) not null
);

alter table project_subscription add column deleted boolean default false;