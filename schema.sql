create database webhistorical;

use webhistorical;

create table webpages (url VARCHAR(50), html MEMO(200000), createdAt date);