// holds all knowledge to tell graphql what app data looks like
// what props each have and how they are related
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;
const axios = require('axios');
const serverEndpoint = 'http://localhost:3000';

// only used for static find method
// const _ = require('lodash');

// needs root query
// to jump into our data

// use () => to make use of closures
// so function is defined but not executed until later
// js and scoping, this is really closures 101

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString},
    name: { type: GraphQLString},
    description: { type: GraphQLString},
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`${serverEndpoint}/companies/${parentValue.id}/users`)
          .then(res => res.data);
      }
    }
  })
})

// instruct about user type what it looks like
const UserType = new GraphQLObjectType({
  name:'User',
    fields: () => ({
    id: { type: GraphQLString},
    firstName: { type: GraphQLString},
    age: { type: GraphQLInt},
    company: { 
      type: CompanyType,
      // resolves differences between json and data type
      resolve(parentValue, args) {
        const { companyId } = parentValue;
        return axios
          .get(`${serverEndpoint}/companies/${companyId}`)
          .then(res => res.data);
        // console.log(parentValue, args);
      }
    }
  })
});

// no longer used
// const users = [
//   { id: '23', firstName: 'Bill', age: 20},
//   { id: '47', firstName: 'Samantha', age: 21},
// ];

// jump and land on specific node
// so arguments are if you send an id
// I will give you back a user
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      /**
       * Most important function here
       * can fetch data from anywhere
       */
      resolve(parentValue, args) {
        // oh you want id
        // here we go into db or store
        // and find data we are looking for
        // parentValue almost never used
        // args, object called with whatever passed into original query
        // NOT USING, only for static return _.find(users, { id: args.id}); // get first user with id args.id
        return axios.get(`${serverEndpoint}/users/${args.id}`)
          .then(response => response.data); // will get back data, nested on data property. How axios works 
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString}},
      resolve(parentValue, args) {
        return axios.get(`${serverEndpoint}/companies/${args.id}`)
          .then( resp => resp.data);
      }
    }
  }
});

// root query points us to user
// resolve takes us from one location on graph to another
// resolve(null, {id: 23}) --> resolve(user23, {})
// functions that return references to other areas in graph
// NODE is piece of data/USER DATA, RESOLVE function is edge on graph



const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      // describe operation for mutation
      type: UserType,
      args: {
        // validation for non null, helper is low level piece of validation
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: {type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }) {
        return axios
          .post(`${serverEndpoint}/users`, {firstName, age})
          .then( res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: { 
        id: { 
          type: new GraphQLNonNull(GraphQLString) 
        }
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`${serverEndpoint}/users/${id}`)
          .then( res => res.data)
      }
    },
    editUser: {
      type: UserType,
      args: { 
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .patch(`${serverEndpoint}/users/${args.id}`, args)
          .then( res => res.data );
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});


// NOTES ABOUT query in graphql
/**
 * 
 * if you search for query on company(id: "1") and company(id: "2")
 * you have to rename them like this apple: company(id: "1") 
 * to avoid duplciate keys
 * 
 * query fragments to handle large code requests
 * say you have 5 fragments
 * company details on 
 * 
 * query fragments, a list of dif
 * 
 * fragment companyDetails on Company {
 *  id
 *  name
 *  description
 * }
 * 
 * apple: company(id: "1") {
 *  ...companyDetails
 * }
 * 
 */


/**
 * MUTATIONS
 * 
 * CRUD operations
 * challenging to work with
 * 
 * A Mutation which might add a user
 * or delete a user
 * tied to mutations object
 * 
 * You must ask for some property coming back
 * 
 * what got resolved from resolved function
 * 
 * 
 * 
 * GOTCHAS
 * put vs patch
 * put to replace existing record with details in body
 * 
 * patch
 * only overrites properties in request body
 * id: "23", firstName: "billy"
 */