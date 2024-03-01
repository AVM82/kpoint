alter table public.projects
    alter column description type varchar(3000),
alter column description set not null;
