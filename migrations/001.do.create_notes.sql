CREATE TABLE folders (
  id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name TEXT NOT null
);

CREATE TABLE notes (
  id integer primary key generated by default as IDENTITY,
  name text not null,
  modified text not null,
  content text not null,
  folderid integer references folders(id)
  on delete cascade
);
