# Api Documentation

## Data Models

### Users

   Column   |          Type          | Collation | Nullable |              Default
------------+------------------------+-----------+----------+-----------------------------------
 id         | integer                |           | not null | nextval('users_id_seq'::regclass)
 first_name | character varying(255) |           | not null |
 last_name  | character varying(255) |           | not null |
 email      | character varying(255) |           | not null |
 admin      | boolean                |           |          | false
 dept_id    | integer                |           |          |


### Tickets 

       Column        |          Type          | Collation | Nullable |               Default
---------------------+------------------------+-----------+----------+-------------------------------------
 id                  | integer                |           | not null | nextval('tickets_id_seq'::regclass)
 description         | character varying(255) |           | not null |
 attempted_solutions | character varying(255) |           | not null |
 submitted_by        | integer                |           | not null |
 priority_id         | integer                |           | not null |
 assigned_to         | integer                |           |          |
 status              | character varying(255) |           |          |
 dept_id             | integer                |           |          |


 ### User Passwords 

   Column  |          Type          | Collation | Nullable |                  Default
----------+------------------------+-----------+----------+--------------------------------------------
 id       | integer                |           | not null | nextval('user_passwords_id_seq'::regclass)
 password | character varying(255) |           | not null |
 user_id  | integer                |           |          |



#### Categories

    Column |          Type       | Nullable |    Default
--------+------------------------+-----------+--------------
 id     | integer                |  not null | 
 name   | character varying(255) |           |  


### Departments 

 Column |  Type   | Collation | Nullable |                 Default
--------+---------+-----------+----------+-----------------------------------------
 id     | integer |           | not null | nextval('departments_id_seq'::regclass)
 name   | text    |           |          |


 ### Ticket Categories

   Column    |  Type   | Collation | Nullable |                    Default
-------------+---------+-----------+----------+-----------------------------------------------
 id          | integer |           | not null | nextval('ticket_categories_id_seq'::regclass)
 ticket_id   | integer |           |          |
 category_id | integer |           |          |

 ### Priorities 

  Column |  Type   | Collation | Nullable |                Default
--------+---------+-----------+----------+----------------------------------------
 id     | integer |           | not null | nextval('priorities_id_seq'::regclass)
 level  | integer |           |          | 1


 ## Routes 

 ##### POST /api/auth/register 

       -  must provide first_name, last_name, email, password
       - returns created user info, including user's id

 ##### POST /api/auth/login

      - requires email and password, if successful, resolves with jwt.


 #### GET  /api/user

    -developmental route to test token is validating correctly.


