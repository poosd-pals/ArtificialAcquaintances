Schemas for tables stored in database

Table: UserInfo

Table stores directory info and login credentials for each user.

| Column | Datatype | Desc. |
| --- | --- | --- |
| UserID | int | Primary key in UserInfo, foreign key in ContactInfo |
| username | nvarchar(50) | login credential |
| password | char(32) | md5 hash of password |
| FirstName | nvarchar(50) | user's first name |
| LastName | nvarchar(50) | user's last name |
| DOB | date | user's date of birth |
| email | nvarchar(50) | user's email address |
| PhoneNum_CountryCode | varchar(10) | country code for user's number |
| PhoneNum_AreaCode | varchar(5) | area code for user's number |
| PhoneNum | varchar(10) | user's phone number with country code and area code removed |


Table: ContactInfo

Table stores contact info entered by the user

| Column | Datatype | Desc. |
| --- | --- | --- |
| EntryID | int | Primary key for ContactInfo |
| UserID | int | Primary key for UserInfo, foreign key for ContactInfo |
| FirstName | nvarchar(50) | user's first name |
| LastName | nvarchar(50) | user's last name |
| DOB | date | user's date of birth |
| email | nvarchar(50) | user's email address |
| PhoneNum_CountryCode | varchar(10) | country code for user's number |
| PhoneNum_AreaCode | varchar(5) | area code for user's number |
| PhoneNum | varchar(10) | user's phone number with country code and area code removed |
