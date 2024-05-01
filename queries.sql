create table books (
    id serial primary key,
    title varchar(200) not null,
    isbn varchar(20) not null,
    Description text,
    rating numeric(3,2) check (rating>=0 and rating<=5)
);