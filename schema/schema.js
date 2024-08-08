//graphQL = 50% query + 50% schema

const graphql = require('graphql')
// const _ = require('lodash')
const axios = require('axios').default

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql

// const users = [
//   { id: '11', firstName: 'Bill', age: 20 },
//   { id: '22', firstName: 'Anne', age: 29 },
// ]

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios(
          `http://localhost:3000/companies/${parentValue.id}/users`
        ).then((resp) => resp.data)
      },
    },
  }),
})
// 1 resolver == 1 graph edge

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        console.log(parentValue, args)
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((res) => res.data)
      },
    },
  }),
})
//
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    userJa: {
      //
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        // return _.find(users, { id: args.id })
        //can return raw json or js obj

        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((resp) => resp.data)
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((resp) => resp.data)
      },
    },
  },
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType, //can be sth else depends on requirement
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, { firstName, age }) {
        return axios
          .post('http://localhost:3000/users', { firstName, age })
          .then((res) => res.data)
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation, //mutation: mutation
})
