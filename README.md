# graphql-example

## Notes on Graphql for FE implemntation

## document
[Link to GraphQl casts](https://github.com/StephenGrider/GraphQLCasts)
Balsamiq Mockups
Iterm zShell


## Why GRAPH QL it exsits

### Restful Routing
given a collection of records on server
a uniform url and http requests made to use the records
CRUD operations
POST, GET, PUT, DELETE

updating to handle posts
/users/23/posts POST
/users/23/posts/14 GET
...
nesting records if we want to get

but nesting data even further?
Gets even weirder...

user image, user name, company name, position name
how might we store this data in mongo db?

User model with `id`, `name`, `image`, `compnay_name`, `position_name`

Might have collection of Users, collection of Company, Position. Etc.
What restful conventions? Current User, then users/23/friends, but what url to get company or position for each friend?

You have to make all these endpoints
But now we do a particular RESTFUL endpoint
`/users/23/friends_with_compnanies_and_positions`
conventions break down with highly related data, customized endpoints. Moreover, we end up sending all this data back
With highly relational data gets very challenging


### Shortcomings

when festing heavily nested data, make too many nested requests
vurnerable to over fetching data
how graphql solves restful routing

Relations
graph of all nodes, relations between nodes which is edges.
Graph of the data structure is what GraphQL is addressing

query to graphql
find user with id 23, then find all friends with user 23
then get company with all friends

## How to do this?
write a query to do this.
User then crawl to other user
query {
    user(id: "23") {
        friends {
            company {
                name // from company
            }
        }
    }
}

goal graph ql, users with friends, company and position


## How do we do it?

